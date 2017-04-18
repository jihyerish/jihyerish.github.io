(function(scope) {
	"use strict";

	// Running rAF on the compositor thread
	scope.compositorTick = function(timestamp) {
    if (!scroller.initialized || !parallax.initialized) {
      scope.requestAnimationFrame(compositorTick);
      return;
    }
    var t = parallax.transform;
    var newOffset = -0.1 * scroller.scrollTop;

	t.m42 = newOffset;
    parallax.transform = t;
    scope.requestAnimationFrame(compositorTick);
  };

  // Get proxy from the main thread and start rAF on the compositor thread
	scope.initWorker = function() {
		self.onmessage = function(e) {
			scope.scroller = e.data[0];
			scope.parallax = e.data[1];

			scope.requestAnimationFrame(compositorTick);
		};
  	};

	initWorker();
})(self);