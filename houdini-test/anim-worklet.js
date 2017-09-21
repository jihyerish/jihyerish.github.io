/*
Copyright 2016 Google, Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
(function(scope) {
  "use strict";

  // TODO(flackr): Detect if we have native support for animationWorklet.

  // The current list of animated elements.
  var animatedElements = {};

  // Callback dispatched when the set of animated elements is updated.
  var onElementsUpdated = function() {};

  // The implementation of AnimationWorklet which uses a CompositorWorker to
  // implement animations on the compositor thread.
  var CompositorWorkerAnimationWorklet = function() {
    var awaitingPromises = [];

    // Find the path of this running script to locate the worker helper.
    var scriptEls = document.getElementsByTagName( 'script' );
    var thisScriptEl = scriptEls[scriptEls.length - 1];
    var scriptPath = thisScriptEl.src;
    var scriptFolder = scriptPath.substr(0, scriptPath.lastIndexOf( '/' ) + 1);

    var animators = {};

    var cw = new CompositorWorker(scriptFolder + 'anim-worklet-worker.js');
    cw.onmessage = function(event) {
      var data = event.data;
      if (data.resolve) {
        if (data.resolve.success)
          awaitingPromises[data.resolve.id].resolve(data.resolve.arguments);
        else
          awaitingPromises[data.resolve.id].reject(data.resolve.arguments);
        delete awaitingPromises[data.resolve.id];
      }
      if (data.type == 'log') {
        console.log(data.message);
      } else if (data.type == 'animator') {
        animators[data.name] = data.details;
        // TODO(flackr): Do a targeted update of just the added animation worklet.
        updateCWElements();
      }
    };

    onElementsUpdated = updateCWElements;

    function getProperties(elem, properties) {
      var result = {}
      var cs = getComputedStyle(elem);
      for (var i = 0; i < properties.length; i++) {
        result[properties[i]] = cs.getPropertyValue(properties[i]).trim();
      }
      return result;
    }

    var acceleratedStyles = {
      'opacity': true,
      'transform': true};
    function filterCompositedProperties(inputPropertyList, outputPropertyList) {
      var accelerated = [];
      for (var i = 0; i < inputPropertyList.length; i++) {
        if (acceleratedStyles[inputPropertyList[i]])
          accelerated.push(inputPropertyList[i]);
      }
      for (var i = 0; i < outputPropertyList.length; i++) {
        if (acceleratedStyles[outputPropertyList[i]])
          accelerated.push(outputPropertyList[i]);
      }
      return accelerated;
    }

    function updateCWElements() {
      var elementUpdate = {};
      for (var animator in animators) {
        var details = animators[animator];
        var roots = animatedElements[animator];
        if (!roots)
          continue;
        elementUpdate[animator] = [];
        for (var i = 0; i < roots.length; i++) {
          var rootProperties = filterCompositedProperties(details.rootInputProperties, details.rootOutputProperties);
          if (details.rootInputScroll || details.rootOutputScroll) {
            rootProperties.push('scrollTop');
            rootProperties.push('scrollLeft');
          }
          elementUpdate[animator].push({
            'root': roots[i].root ? {
              'proxy': rootProperties.length ? new CompositorProxy(roots[i].root, rootProperties) : null,
              'styleMap': getProperties(roots[i].root, details.inputProperties)} : null,
            'children': [],
          });
          for (var j = 0; j < roots[i].children.length; j++) {
            var properties = filterCompositedProperties(details.inputProperties, details.outputProperties);
            if (details.inputScroll || details.outputScroll) {
              properties.push('scrollTop');
              properties.push('scrollLeft');
            }
            elementUpdate[animator][i].children.push({
              'proxy': properties.length ? new CompositorProxy(roots[i].children[j], properties) : null,
              'styleMap': getProperties(roots[i].children[j], details.inputProperties),
            });
          }
        }
      }
      cw.postMessage({'type': 'updateElements', 'elements': elementUpdate});
    };

    function importOnCW(src) {
      return get(src).then(function(response) {
        return new Promise(function(resolve, reject) {
          var nextId = awaitingPromises.length;
          awaitingPromises[nextId] = {'resolve': resolve, 'reject': reject};
          cw.postMessage({'type': 'import', 'src': src, 'content': response, 'id': nextId});
        });
      });
    }

    return {
      'import': importOnCW,
    };
  };

  function updateElements() {
    animatedElements = {};
    var elements = document.getElementsByTagName("*");
    for (var i = 0; i < elements.length; ++i) {
      var elem = elements[i];
      var animator = getComputedStyle(elem).getPropertyValue('--animator');
      // TODO(flackr): This is a hack for not getting inherited animator properties.
      var parentAnimator = elem.parentElement && getComputedStyle(elem.parentElement).getPropertyValue('--animator');
      if (animator && animator != parentAnimator) {
        animator = animator.trim();
        animatedElements[animator] = animatedElements[animator] || [{'root': undefined, 'children': []}];
        animatedElements[animator][0].children.push(elem);
      }

      var animatorRoot = getComputedStyle(elem).getPropertyValue('--animator-root');
      // TODO(flackr): This is a hack for not getting inherited animator properties.
      var parentAnimatorRoot = elem.parentElement && getComputedStyle(elem.parentElement).getPropertyValue('--animator-root');
      if (animatorRoot && animatorRoot != parentAnimatorRoot) {
        animatorRoot = animatorRoot.trim();
        animatedElements[animatorRoot] = animatedElements[animatorRoot] || [{'root': undefined, 'children': []}];
        // TODO(flackr): Support multiple roots.
        animatedElements[animatorRoot][0].root = elem;
      }
    };
    onElementsUpdated();
  }
  document.addEventListener('DOMContentLoaded', updateElements);

  var MainThreadAnimationWorklet = function() {
    function importOnMain(src) {
      console.warn('Using main thread polyfill of AnimationWorklet, animations will not be performance isolated.');
      return new Promise(function(resolve, reject) {
        var script = document.createElement('script');
        script.src = src;
        script.onload = function() {
          resolve();
        }
        script.onerror = function() {
          reject(Error('Failed to load ' + src));
        }
        document.body.appendChild(script);
      });
    }

    var ctors = {};
    var animators = {};
    // This is invoked in the worklet to register |name|.
    scope.registerAnimator = function(name, ctor) {
      ctors[name] = ctor;
      animators[name] = {
        'inputProperties': ctor.inputProperties || [],
        'outputProperties': ctor.outputProperties || [],
        'inputScroll': !!ctor.inputScroll,
        'outputScroll': !!ctor.outputScroll,
        'rootInputProperties': ctor.rootInputProperties || [],
        'rootOutputProperties': ctor.rootOutputProperties || [],
        'rootInputScroll': !!ctor.rootInputScroll,
        'rootOutputScroll': !!ctor.rootOutputScroll,
      };
      // TODO(flackr): Do a targeted update of just the added animation worklet.
      updateRunningAnimators();
    };

    class ElementProxy {
      constructor(element, inputScroll, outputScroll, inputProperties, outputProperties) {
        this.styleMap = new ElementStyleMap(element, inputProperties, outputProperties);
        this.scrollOffsets = new ElementScrollMap(element, inputScroll, outputScroll);
      }
    };

    class ElementStyleMap {
      constructor(element, inputProperties, outputProperties) {
        // TODO(flackr): Restrict output properties based on constructor param.
        this.element_ = element;
        this.style_ = getComputedStyle(element);
        for (var i = 0; i < inputProperties.length; i++) {
          // Skip copying "accelerated" properties.
          var property = inputProperties[i];
          if (property == 'transform' || property == 'opacity')
            continue;
          this[property] = this.style_.getPropertyValue(property).trim();
        }
      };

      get(key) { return this[key]; }
      set(key, val) { this[key] = val; }

      get opacity() { return this.style_.opacity; }
      set opacity(val) { this.element_.style.opacity = val; }
      get transform() { return this.style_.transform == 'none' ? new DOMMatrix() : new DOMMatrix(this.style_.transform); };
      set transform(val) { this.element_.style.transform = val.toString(); };
    };

    class ElementScrollMap {
      constructor(element, input, output) {
        // TODO(flackr): Restrict access to input / output scroll according to constructor params.
        this.element_ = element;
      }

      get top() { return this.element_.scrollTop; }
      set top(val) { this.element_.scrollTop = val; }
      get left() { return this.element_.scrollLeft; }
      set left(val) { this.element_.scrollLeft = val; }
    };

    var runningAnimators = {};
    onElementsUpdated = updateRunningAnimators;
    function updateRunningAnimators() {
      runningAnimators = {};
      for (var animator in animators) {
        var details = animators[animator];
        var roots = animatedElements[animator];
        if (!roots)
          continue;
        runningAnimators[animator] = [];
        for (var i = 0; i < roots.length; i++) {
          var rootProperties = [];
          if (details.rootInputScroll) {
            rootProperties.push('scrollTop');
            rootProperties.push('scrollLeft');
          }
          runningAnimators[animator].push({
            'animator': new ctors[animator](),
            'root': roots[i].root ? new ElementProxy(roots[i].root, details.rootInputScroll, details.rootOutputScroll, details.rootInputProperties, details.rootOutputProperties) : null,
            'children': [],
          });
          for (var j = 0; j < roots[i].children.length; j++) {
            runningAnimators[animator][i].children.push(new ElementProxy(roots[i].children[j],
                details.inputScroll, details.outputScroll, details.inputProperties, details.outputProperties));
          }
        }
      }
    }

    var timeline = {'currentTime': 0};
    function raf(ts) {
      timeline.currentTime = ts;
      for (var animator in runningAnimators) {
        for (var i = 0; i < runningAnimators[animator].length; i++) {
          var desc = runningAnimators[animator][i];
          desc.animator.animate(desc.root, desc.children, timeline);
        }
      }

      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    var animators = {};

    // Polyfill of DOMMatrix if unavailable.
    if (!scope.DOMMatrix) {
      // Note: Only 'matrix(...)' and 'matrix3d(...)' are supported.
      scope.DOMMatrix = function(transformDesc) {
        this.m11 = 1;
        this.m21 = 0;
        this.m31 = 0;
        this.m41 = 0;

        this.m12 = 0;
        this.m22 = 1;
        this.m32 = 0;
        this.m42 = 0;

        this.m13 = 0;
        this.m23 = 0;
        this.m33 = 1;
        this.m43 = 0;

        this.m14 = 0;
        this.m24 = 0;
        this.m34 = 0;
        this.m44 = 1;

        if (transformDesc && typeof(transformDesc) == 'string') {
          if (transformDesc.startsWith('matrix(')) {
            var values = transformDesc.substring(7, transformDesc.length - 1).split(', ').map(parseFloat);
            if (values.length != 6)
              throw new Error('Unable to parse transform string: ' + transformDesc);
            this.m11 = values[0];
            this.m12 = values[1];
            this.m21 = values[2];
            this.m22 = values[3];
            this.m41 = values[4];
            this.m42 = values[5];
          } else if (transformDesc.startsWith('matrix3d(')) {
            var values = transformDesc.substring(9, transformDesc.length - 1).split(', ').map(parseFloat);
            if (values.length != 16)
              throw new Error('Unable to parse transform string: ' + transformDesc);
            this.m11 = values[0];
            this.m12 = values[1];
            this.m13 = values[2];
            this.m14 = values[3];

            this.m21 = values[4];
            this.m22 = values[5];
            this.m23 = values[6];
            this.m24 = values[7];

            this.m31 = values[8];
            this.m32 = values[9];
            this.m33 = values[10];
            this.m34 = values[11];

            this.m41 = values[12];
            this.m42 = values[13];
            this.m43 = values[14];
            this.m44 = values[15];
          } else {
            throw new Error('Unable to parse transform string: ' + transformDesc);
          }
        }
      };

      scope.DOMMatrix.prototype = {
        toString: function(element) {
          return 'matrix3d(' +
              this.m11 + ', ' + this.m12 + ', ' + this.m13 + ', ' + this.m14 + ', ' +
              this.m21 + ', ' + this.m22 + ', ' + this.m23 + ', ' + this.m24 + ', ' +
              this.m31 + ', ' + this.m32 + ', ' + this.m33 + ', ' + this.m34 + ', ' +
              this.m41 + ', ' + this.m42 + ', ' + this.m43 + ', ' + this.m44 + ')';
        },
      };
    }

    return {
      'import': importOnMain,
    }
  };

  // Minimal Promise implementation for browsers which do not have promises.
  scope.Promise = scope.Promise || function(exec) {
    var then = undefined;
    var resolve = function() {
      if (!then)
        throw new Error('No function specified to call on success.');
      then.apply(null, arguments);
    }.bind(this);
    var reject = function(e) { throw e; };
    this.then = function(fn) { then = fn; };
    exec(resolve, reject);
  };

  scope.String.prototype.startsWith = scope.String.prototype.startsWith || function(s) {
    return this.substring(0, s.length) == s;
  };

  function get(url) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      // TODO(flackr): Figure out why we keep getting stale response when using 'GET'.
      req.open('GET', url);

      req.onload = function() {
        if (req.status == 200)
          resolve(req.response);
        else
          reject(Error(req.statusText));
      };

      req.onerror = function() {
        reject(Error("Network error"));
      };

      req.send();
    });
  }

  // TODO(flackr): It seems we can't properly polyfill animationWorklet because it exists with --experimental-web-platform-features and seems to be read-only.
  scope.polyfillAnimationWorklet = scope.CompositorWorker ? CompositorWorkerAnimationWorklet() : MainThreadAnimationWorklet();
  scope.polyfillAnimationWorklet.updateElements = updateElements;

})(self);