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

// Set Option information to URL
var setOptions = function (params) {

  window.location.search = '?' + "noworklet=" + params["noworklet"] + 
                      '&' + "delayValue=" + params["delayValue"];
};

 // Get Option information form URL
var getOptions = function () {
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

var options = getOptions();

var rafScheduled = false;
var tick = function(timestamp) {
  var offset = -0.1 * scroller.scrollTop;
  window.parallax.style.transform = 'translate(0, ' + offset + 'px)';
  requestAnimationFrame(tick);
  rafScheduled = false;
};

window.scroller = document.querySelector('.scroll');
window.parallax = document.querySelector('.parallax');

// Initialize the delay time option
var delay = options["delayValue"];
document.getElementById("delayValue").innerHTML = delay;
document.getElementById("delayRange").value = delay;

// Get the delay time for janks
document.getElementById("delayRange").addEventListener("change", function(evt) {
  delay = evt.target.value;
  document.getElementById("delayValue").innerHTML = delay;
});

// Make janks by giving delay **ms per frame in the main thread
requestAnimationFrame(function jankRAF(timestamp) {
  while (window.performance.now() - timestamp < delay) {}
  requestAnimationFrame(jankRAF);
});

// Scroll to the end and then goes to up infinitely
var repeatableScroll = function() {
  if (window.scroller.scrollTop < window.scroller.scrollHeight / 2) {
    console.log("scroll down");
    window.scroller.scrollTop = window.scroller.scrollHeight;
  }
  else {
    console.log("scroll up");
    window.scroller.scrollTop = 0;
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

  window.scroller.addEventListener("scroll", handler);
};

// Scroll down the text
window.document.querySelector('#scrollDown').onclick = function() {
  window.scroller.scrollTop = window.scroller.scrollHeight;
};

// Scroll down and up the text infinitely 
window.document.querySelector('#scrollInfinite').onclick = function() {
  repeatableScroll();
};

// Apply Options
window.document.querySelector('#options button').onclick = function() {
  var urlParams = {
        noworklet: !document.getElementById("useAnimationWorklet").checked,
        delayValue: document.getElementById("delayRange").value
      };

  setOptions(urlParams);

  console.log(location.search);
};

// Initialize the animation worklet option
if(options["noworklet"]) {
  // Scroll using main thread rAF
  document.getElementById("useAnimationWorklet").checked = false;

  console.log('Using main thread rAF');
  // Force scrolling text field and image on their own comp layer
  window.parallax.style.willChange = 'transform';
  window.scroller.style.willChange = 'transform';
  window.scroller.onscroll = function() {
    // Only schedule rAF once per frame
    if (!rafScheduled) {
      requestAnimationFrame(tick);
    }
    rafScheduled = true;
  };
} else {  
  // Scroll using compositor worklet rAF
  document.getElementById("useAnimationWorklet").checked = true;

  console.log('Using compositor worklet rAF');
  window.polyfillAnimationWorklet.import('parallax-animator.js');
}