(function() {
  var useAnimationWorklet = document.getElementById("useAnimationWorklet");
  var defaultVal = document.getElementById("delayRange");

  var setOptions = function (params) {

    console.log("noworklet: "+ params["noworklet"]+ 
      "delayValue"+ params["delayValue"]);

    location.search = '?' + "noworklet=" + params["noworklet"] + 
                      '&' + "delayValue=" + params["delayValue"];
  };

  document.querySelector('#options button').onclick = function() {
    var urlParams = {
      noworklet: !useAnimationWorklet.checked,
      delayValue: defaultVal.value
    };

    setOptions(urlParams);

    console.log(location.search);
  };
})();