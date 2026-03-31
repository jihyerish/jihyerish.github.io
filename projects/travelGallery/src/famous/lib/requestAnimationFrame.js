// adds requestAnimationFrame functionality
// Source: http://strd6.com/2011/05/better-window-requestanimationframe-shim/
// Source: http://code.famo.us/lib/requestAnimationFrame.js

window.requestAnimationFrame || (window.requestAnimationFrame =
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback, element) {
        return window.setTimeout(function () {
            callback(+new Date());
        }, 1000 / 60);
    });