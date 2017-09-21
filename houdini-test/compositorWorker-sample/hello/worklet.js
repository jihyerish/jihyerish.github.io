//worklet.js
(function(scope) {
  "use strict";

  scope.isMain = function() {
    return scope.window;
  };

  scope.tick = function(timestamp) {
    proxy.transform.m14 = 100.0 * Math.sin(timestamp / 1000.0);
    scope.requestAnimationFrame(tick);
  };

  scope.initWorker = function() {
    console.log("init worker");
    self.onmessage = function(e) {
      console.log("onmessage");
      scope.proxy = e.data[0];
      scope.requestAnimationFrame(tick);
    };
  };

  scope.initMain = function() {
    console.log("init main");

    scope.worker = new CompositorWorker("worklet.js");
    var item = document.getElementById("item");

    scope.proxy = new CompositorProxy(item, ['transform']);
    worker.postMessage([proxy]);

    console.log("proxy: "+ scope.proxy);
  };

  if (isMain())
    initMain();
  else
    initWorker();
})(self);