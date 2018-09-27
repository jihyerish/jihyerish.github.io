(function(scope) {
  "use strict";

  var rafScheduled = false;

  // Running rAF on the main thread
  scope.mainTick = function(timestamp) {
    var offset = -0.1 * scope.scrollElement.scrollTop;
    scope.parallaxBG.style.transform = 'translate(0, ' + offset + 'px)';
    requestAnimationFrame(mainTick);
    rafScheduled = false;
  };

  // Scroll to the end and then goes to up infinitely
  scope.repeatableScroll = function() {

    if (scope.scrollElement.scrollTop < scope.scrollElement.scrollHeight / 2) {
      scope.scrollElement.scrollTop = scope.scrollElement.scrollHeight;
    }
    else {
      scope.scrollElement.scrollTop = 0;
    }

    var handler = function(e) {

        document.querySelector('#scrollStop').onclick = function() {
          var currentScrollPosition = e.target.scrollTop;
          e.target.removeEventListener("scroll", handler);
          return;
        };
     
        if (e.target.scrollHeight == (e.target.scrollTop + e.target.clientHeight)) {   //end of scrolling
          e.target.scrollTop = 0;
        }
        else if (e.target.scrollTop == 0) { //start of scrolling
          e.target.scrollTop = e.target.scrollHeight;
        }
    } 

    scope.scrollElement.addEventListener("scroll", handler);
    
  };

  // Set Option information to URL
  scope.setOptions = function (params) {

    location.search = '?' + "noworklet=" + params["noworklet"] + 
                      '&' + "delayValue=" + params["delayValue"];
  };

  // Get Option information form URL
  scope.getOptions = function () {
    var urlParams = {};
    var query = window.location.search;
    var regex = /[?&;](.+?)=([^&;]+)/g;
    var match;

    if (query) {
      while (match = regex.exec(query)) {
        urlParams[match[1]] = decodeURIComponent(match[2]);
      }

      if (urlParams["noworklet"] == "false")
        urlParams["noworklet"] = false;
      else
        urlParams["noworklet"] = true;
    }
    else {
      urlParams["noworklet"] = false;
      urlParams["delayValue"] = 100;
    } 

    return urlParams;
  };

  scope.initMain = function() {
    rafScheduled = false;

    scope.scrollElement = document.querySelector('.scroll');
    scope.parallaxBG = document.querySelector('.parallax');

    // Get option information
    var options = getOptions();

    // Initialize the delay time option
    scope.delay = options["delayValue"];
    document.getElementById("delayValue").innerHTML = scope.delay;
    document.getElementById("delayRange").value = scope.delay;

    // Get the delay time for janks
    document.getElementById("delayRange").addEventListener("change", function(evt) {
      scope.delay = evt.target.value;
      document.getElementById("delayValue").innerHTML = scope.delay;
    });

    // Make janks by giving delay **ms per frame in the main thread
    requestAnimationFrame(function jankRAF(timestamp) {      
      while (window.performance.now() - timestamp < scope.delay) {}
      requestAnimationFrame(jankRAF);
    });

    // Scroll down the text
    document.querySelector('#scrollDown').onclick = function() {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    };

    // Scroll down and up the text infinitely 
    document.querySelector('#scrollInfinite').onclick = function() {
      repeatableScroll();
    };

    // Apply Options
    document.querySelector('#options button').onclick = function() {
      var urlParams = {
        noworklet: !document.getElementById("useCW").checked,
        delayValue: document.getElementById("delayRange").value
      };

      setOptions(urlParams);

      console.log(location.search);
    };

    if (options["noworklet"]) {
      // Scroll using compositor worklet rAF
      console.log('Using main thread rAF');
      document.getElementById("useCW").checked = false;

      parallaxBG.style.willChange = 'transform';
      scrollElement.style.willChange = 'transform';
      
      scrollElement.onscroll = function() {
        // Only schedule rAF once per frame
        if (!rafScheduled) {
          requestAnimationFrame(mainTick);
        }
        rafScheduled = true;
      };
    }
    else {
      // Scroll using main thread rAF
      console.log('Using compositor worklet rAF');
      document.getElementById("useCW").checked = true;

      scope.worker = new CompositorWorker("compositor-worklet.js");

      scope.scroller = new CompositorProxy(scrollElement, ['scrollTop']);
      scope.parallax = new CompositorProxy(parallaxBG, ['transform']);

      worker.postMessage([scroller, parallax]);
    }
  };

  initMain();

})(self);