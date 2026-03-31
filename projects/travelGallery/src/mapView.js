/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/**
 * Gallery Demo - Map section
 * ver 0.3.2
 *
 * created by Jihye Hong (LG Elec. SWP. WMT team)
 */
define(function(require, exports, module) {
  const mapDir = '../src/map/';

  const Engine = require('famous/core/Engine');
  const Surface = require('famous/core/Surface');
  const Flipper = require('famous/views/Flipper');
  const Modifier = require('famous/core/Modifier');
  const RenderController = require('famous/views/RenderController');
  const Transform = require('famous/core/Transform');
  const ImageSurface = require('famous/surfaces/ImageSurface');
  const Easing = require('famous/transitions/Easing');
  const SpringTransition = require('famous/transitions/SpringTransition');
  const SnapTransition = require('famous/transitions/SnapTransition');
  const TransitionableTransform = require('famous/transitions/TransitionableTransform');
  const Transitionable = require('famous/transitions/Transitionable');
  const KeyCodes = require('famous/utilities/KeyCodes');
  const MapData = require('../src/map/map_data');
  const AlbumData = require('../src/album_data');

  const mapInitZoomLevel = 6;
  let map;
  const defaultMapCenter = new google.maps.LatLng(10.377359601358178, 32.71171875000007);
  let mapCanvas;

  const dragEndTransition = {duration: 600, curve: 'easeOutBounce'};
  const mouseOverTransition = {curve: 'linear', duration: 400};
  const effect_2 = {duration: 2000, curve: Easing.inOutQuad};
  const effect_3 = {curve: 'easeOutBounce', duration: 600};
  const effect_4 = {curve: 'easeIn', duration: 700};
  const effect_5 = {curve: 'easeOutBounce', duration: 300};
  const effect_6 = {curve: 'easeOutBounce', duration: 400};
  Transitionable.registerMethod('Spring', SpringTransition);
  Transitionable.registerMethod('Snap', SnapTransition);

  const opacityZoomTransition = {curve: 'linear', duration: 700};

  const zoomTransition = {
    method: 'Snap',
    period: 650,
    dampingRatio: .4,
    velocity: 0,
  };

  const loadingTransition = {
    method: 'Spring',
    period: 700,
    dampingRatio: .4,
    velocity: 0.0025,
  };

  initializeMap();

  const myMapView = new MapView();

  Engine.on('all-images-loaded', function() {
  });

  // when loading the map is finished in the first time
  // cases :
  // 1. tile_load
  // 2. zoom_change
  // 3. dragend
  // 4. zoom_change + tile_load
  // 5. dragend + tile_load
  google.maps.event.addListener(map, 'tilesloaded', function() {
    if (!map.init) { // animation when
      myMapView.applyZoomLevel(map, myMapView);
      myMapView.drawPlaces(map, myMapView, loadingTransition);

      for (let i=0; i < myMapView.albumNum; i++) {
        myMapView.mainContext.add(myMapView.hotPlace[i].mod).add(myMapView.hotPlace[i]);
      }

      map.init = 1;
    } else if (map.zoomChanged) {
      myMapView.applyZoomLevel(map, myMapView);
      myMapView.drawPlacesWhenZoom(map, myMapView, zoomTransition);
    } else if (map.dragend) {
      myMapView.drawPlacesWhenDrag(map, myMapView, dragEndTransition);
    }
  });

  // when zoom level is changed
  google.maps.event.addListener(map, 'zoom_changed', function() {
    myMapView.applyZoomLevel(map, myMapView);
    myMapView.drawPlacesWhenZoom(map, myMapView, zoomTransition);

    map.zoomChanged = 1;
    map.dragend = 0;
  });

  // when dragging the map is end
  google.maps.event.addListener(map, 'dragend', function() {
    myMapView.drawPlacesWhenDrag(map, myMapView, dragEndTransition);

    map.zoomChanged = 0;
    map.dragend = 1;
  });

  // if(myMapView)
  mouseClick(myMapView);

  Engine.on('keydown', function(event) {
    if (event.which == KeyCodes['ENTER']) {
      myMapView.fadeInOutMap(myMapView, 1);
    } else if (event.which == KeyCodes['SPACE']) {
      myMapView.fadeInOutMap(myMapView, 0);
    }
  });

  /**
	 * @ initialize Map Function
	 * @private
	 * @param MapView
	 */
  function initializeMap() {
    const mapOptions = {
      zoom: mapInitZoomLevel,
      minZoom: 5,
      maxZoom: 8,
    };
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const [lightLand, darkLand] = ['#f8f5f2', '#232946'];
    const [lightWater, darkWater] = ['#5E9DC8', '#DCF0F7'];

    mapCanvas = document.getElementById('map-canvas');
    map = new google.maps.Map(mapCanvas, mapOptions);
    map.options = mapOptions;


    map.ZoomStyle =
		[
		  {
		    'stylers': [
		      {
		        'visibility': 'off',
		      },
		    ],
		  },
		  {
		    'featureType': 'water',
		    'stylers': [
		      {
		        'visibility': 'simplified',
		      },
		      {
		        'color': (currentTheme === 'light') ? lightWater : darkWater,
		      },
		    ],
		  },
		  {
		    'featureType': 'landscape',
		    'stylers': [
		      {
		        'visibility': 'on',
		      },
		      {
		        'color': (currentTheme === 'light') ? lightLand : darkLand,
		      },
		    ],
		  },
		  {
		    'featureType': 'administrative',
		    'elementType': 'geometry.stroke',
		    'stylers': [
		      {
		        'visibility': 'on',
		      },
		      {
		        'color': 'black',
		      },
		      {
		        'weight': 1,
		      },
		    ],
		  },
		];

    const styledMap = new google.maps.StyledMapType(map.ZoomStyle, {name: 'Styled Map'});
    // Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('map_style', styledMap);

    map.setMapTypeId('map_style');
    map.setCenter(defaultMapCenter);

    map.init = 0;
    map.zoom_changed = 0;
    map.dragend = 0;
    // make mapCanvas to the background
    mapCanvas.style.webkitTransform = 'translateZ(-10px)';
  }

  /**
	 * @ Get Map's zoom level when the map is initialized or map's zoom level is changed
	 * @private
	 * @param map, MapView
	 */
  function getMapZoomLevel(map, mapView) {
    const zoomLevel = map.getZoom();

    mapCanvas.style.webkitTransform = 'translateZ(-10px)';

    return zoomLevel;
  }

  /**
	 * @ Get Location's latitude and longitude
	 * @private
	 * @param address (string type)
	 * @return Array : [latitude, longitude]
	 */
  function getLatLng(address) {
    const geocoder = new google.maps.Geocoder();
    let LatLng = {};
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        LatLng[0] = results[0].geometry.location.lat();
        LatLng[1] = results[0].geometry.location.lng();
      }
    });

    return LatLng;
  }

  /**
	 * Convert lat lng position to pixel coordination
	 * @param {google.maps.Map} map
	 * @param {google.maps.LatLng} latlng
	 * @return {google.maps.Point}
	 */
  function convertAbsolutePoint(map, latlng) {
    const topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
    const bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());

    const scale = Math.pow(2, map.getZoom());
    const worldPoint = map.getProjection().fromLatLngToPoint(new google.maps.LatLng(latlng[0], latlng[1]));
    const pixelPoint = new google.maps.Point((worldPoint.x- bottomLeft.x)*scale, (worldPoint.y-topRight.y)*scale);

    return pixelPoint;
  }

  /**
	 * Convert pixel coordination to parameter for Transform.translate(x,y,z)
	 * @param {google.maps.Point} pixelCoordinate
	 * @return translateValue(x, y)
	 */
  function convertRelativePoint_original(pixelPoint) {
    const translateValue = {};

    translateValue.x = pixelPoint.x - window.innerWidth/2;
    translateValue.y = pixelPoint.y - window.innerHeight/2;
    return translateValue;
  }

  /**
	 * Convert pixel coordination to parameter for Transform.translate(x,y,z)
	 * @param {google.maps.Point} spot's latlng([x][y])
	 * @return translateValue(x, y)
	 */
  function convertRelativePoint(map, latlng) {
    const translateValue = {};
    const distLatLngCenterSpot = {};
    const distPixelCenterSpot = {};

    const distLatLngCenterTopRight = distancePoints({lat: map.getCenter().lat(), lng: map.getCenter().lng()}, {lat: map.getBounds().getNorthEast().lat(), lng: map.getBounds().getNorthEast().lng()});
    const distPixelCenterTopRight = Math.sqrt(Math.pow(window.innerWidth/2, 2) + Math.pow(window.innerHeight/2, 2));

    distLatLngCenterSpot.y = distancePoints({lat: map.getCenter().lat(), lng: map.getCenter().lng()}, {lat: latlng[0], lng: map.getCenter().lng()});
    distLatLngCenterSpot.x = distancePoints({lat: map.getCenter().lat(), lng: map.getCenter().lng()}, {lat: map.getCenter().lat(), lng: latlng[1]});

    distPixelCenterSpot.y = distPixelCenterTopRight * distLatLngCenterSpot.y / distLatLngCenterTopRight;
    distPixelCenterSpot.x = distPixelCenterTopRight * distLatLngCenterSpot.x / distLatLngCenterTopRight;

    if (map.getCenter().lat() > latlng[0])
      translateValue.x = -distPixelCenterSpot.x;
    else
      translateValue.x = distPixelCenterSpot.x;

    if (map.getCenter().lng() > latlng[1])
      translateValue.y = -distPixelCenterSpot.y;
    else
      translateValue.y = distPixelCenterSpot.y;

    return translateValue;
  }

  /**
	 * Distance between 2 points on the map
	 * @param {google.maps.Point} point1, point2
	 * @return distance
	 */
  function distancePoints(point1, point2) {
    const lat1 = point1.lat * Math.PI/180;
    const lat2 = point2.lat * Math.PI/180;
    const lon1 = point1.lng * Math.PI/180;
    const lon2 = point2.lng * Math.PI/180;

    const d = Math.acos(Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1));
    return d;
  }

  // ///////////////////////////////////////////////////////////////////////////////////////
  // // Map ImageView Control
  /**
	 * @class MapView
	 * @constructor
	 * @private
	 * @param
	 */
  function MapView() {
    this.mainContext = Engine.createContext();
    this.mainContext.setPerspective(500);
    this.albumDir = '../src/images/';
    this.albumNum = AlbumData.getSize();
    this.images = [];
    this.img_width = 135;
    this.img_height = 135;
    this.first_index = 0;
    this.hotplaceNum = 0;
    this.oldZoom = mapInitZoomLevel;
    this.Grouplevel = 1;
    this.editImgCnt = 0;

    this.mask = new Surface({
      size: [window.innerWidth, window.innerHeight],
      properties: {
        backgroundImage: 'radial-gradient(circle, rgba(2,2,2,1), rgba(40,43,46,1))',
      },
    });

    this.mask.mod = new Modifier({
      origin: [.5, .5],
      size: [0, 0],
      opacity: 0,
    });

    this.LatLng = [30.20, 13.20];
    this.hotPlace = new Array(this.albumNum);

    for (let i = 0, img; i < this.albumNum; i++) {
      img = loadImages(this.albumDir, AlbumData.getInfo(i));

      this.hotPlace[i] = new Surface({
        size: [this.img_width, this.img_height],
        properties: {
          background: 'url('+img.src+')',
          backgroundSize: this.img_width+'px ' + this.img_height+'px',
          backgroundRepeat: 'no-repeat',
          boxShadow: '3px 3px 3px rgba(22, 22, 22, 0.5)',
          margin: '0 0',
          padding: '0 0',
        },
      });
      this.hotPlace[i].classList.push('cover-image');
      this.hotPlace[i].information = AlbumData.getInfo(i);
      this.hotPlace[i].latlng = MapData.getCityLatLong(AlbumData.getInfo(i).city);
      this.hotPlace[i].grouplatlng = {};
      this.hotPlace[i].coverInfo = createCoverInfoComponent(AlbumData.getInfo(i).city, 'city');
      this.hotPlace[i].mouseoverflag = 0;

      this.hotPlace[i].mod = new Modifier({
        origin: [0.5, 0.5],
        opacity: 1,
      });
    }

    this.mainContext.add(this.mask.mod).add(this.mask);
  }

  /**
	 * @param map, mapView,
	 *        effect : image transition effect
	 *
	 */
  MapView.prototype.drawPlaces = function(map, mapView, effect) {
    const mapZoomLevel = getMapZoomLevel(map, mapView);
    mapCanvas.style.zIndex = -10;
    let groupRelativePoint;

    for (let i=0, relativePoint, tmpEffect; i < mapView.albumNum; i++) {
      // console.log("groupLatLng : "+mapView.hotPlace[i].grouplatlng[0]+","+ mapView.hotPlace[i].grouplatlng[1]);
      if (mapView.hotPlace[i].latlng === mapView.hotPlace[i].grouplatlng) {
        mapView.hotPlace[i].setContent(mapView.hotPlace[i].coverInfo);
        mapView.hotPlace[i].setProperties({visibility: 'visible'});
        relativePoint = convertRelativePoint_original(convertAbsolutePoint(map, mapView.hotPlace[i].grouplatlng));
        mapView.hotPlace[i].mod.setTransform(Transform.translate(relativePoint.x, relativePoint.y, 3), effect);
        mapView.hotPlace[i].mod.setOpacity(1, opacityZoomTransition);
      } else {
        mapView.hotPlace[i].setContent('');
        mapView.hotPlace[i].setProperties({visibility: 'hidden'});
        relativePoint = convertRelativePoint_original(convertAbsolutePoint(map, mapView.hotPlace[i].grouplatlng));
        mapView.hotPlace[i].mod.setTransform(Transform.translate(relativePoint.x, relativePoint.y, 1), effect);
        mapView.hotPlace[i].mod.setOpacity(1, opacityZoomTransition);
      }
    }
    // setTimeout(mapView.hideSubPlaces(map, mapView), 100);
  };

  /**
	 * @param map, mapView,
	 *        effect : image transition effect
	 *
	 */
  MapView.prototype.drawPlacesWhenDrag = function(map, mapView, effect) {
    const mapZoomLevel = getMapZoomLevel(map, mapView);
    mapCanvas.style.zIndex = -10;

    for (let i=0, relativePoint, tmpEffect; i < mapView.albumNum; i++) {
      tmpEffect = {duration: 600+mapView.hotPlace[i].grouplatlng[0]*5, curve: 'easeOutBounce'};

      if (mapView.hotPlace[i].latlng === mapView.hotPlace[i].grouplatlng) {
        mapView.hotPlace[i].setContent(mapView.hotPlace[i].coverInfo);
        mapView.hotPlace[i].setProperties({visibility: 'visible'});
        relativePoint = convertRelativePoint_original(convertAbsolutePoint(map, mapView.hotPlace[i].grouplatlng));
        mapView.hotPlace[i].mod.setTransform(Transform.translate(relativePoint.x, relativePoint.y, 3), tmpEffect);
      } else {
        mapView.hotPlace[i].setContent('');
        mapView.hotPlace[i].setProperties({visibility: 'hidden'});
        relativePoint = convertRelativePoint_original(convertAbsolutePoint(map, mapView.hotPlace[i].grouplatlng));
        mapView.hotPlace[i].mod.setTransform(Transform.translate(relativePoint.x, relativePoint.y, 1), tmpEffect);
      }
    }
  };

  MapView.prototype.upCnt = function(mapView) {
    this.editImgCnt++;
  };

  /**
	 * @param map, mapView,
	 *        effect : image transition effect
	 *
	 */
  MapView.prototype.drawPlacesWhenZoom = function(map, mapView, effect) {
    const mapZoomLevel = getMapZoomLevel(map, mapView);
    const editImgCnt = 0;
    mapCanvas.style.zIndex = -10;

    for (let i=0, relativePoint, tmpEffect; i < mapView.albumNum; i++) {
      tmpEffect = {
        method: 'Snap',
        period: 1000 + mapView.hotPlace[i].grouplatlng[0]*7,
        dampingRatio: .45,
        velocity: 0,
      };

      if (mapView.hotPlace[i].latlng === mapView.hotPlace[i].grouplatlng) {
        relativePoint = convertRelativePoint_original(convertAbsolutePoint(map, mapView.hotPlace[i].grouplatlng));
        mapView.hotPlace[i].mod.setOpacity(1, opacityZoomTransition);

        // if(i==mapView.albumNum - 1)
        // mapView.hotPlace[i].mod.setTransform(Transform.translate(relativePoint.x, relativePoint.y, 3), tmpEffect, showOnlyFrontImages(mapView));
        mapView.hotPlace[i].mod.setTransform(Transform.translate(relativePoint.x, relativePoint.y, 3), tmpEffect, function() {
          // console.log("after");
          showOnlyFrontImages(mapView);
        });
        // else
        // mapView.hotPlace[i].mod.setTransform(Transform.translate(relativePoint.x, relativePoint.y, 3), tmpEffect);
      } else {
        mapView.hotPlace[i].setContent('');
        relativePoint = convertRelativePoint_original(convertAbsolutePoint(map, mapView.hotPlace[i].grouplatlng));
        mapView.hotPlace[i].mod.setOpacity(1, opacityZoomTransition);

        // if(i==mapView.albumNum - 1)
        // mapView.hotPlace[i].mod.setTransform(Transform.translate(relativePoint.x, relativePoint.y, 1), tmpEffect, showOnlyFrontImages(mapView));
        // else
        mapView.hotPlace[i].mod.setTransform(Transform.translate(relativePoint.x, relativePoint.y, 1), tmpEffect);
      }
    }
  };

  /**
	 * @param zoomLevel : when the zoom level of map is changed, the images on the map are affected
	 *        mapView
	* level 8 : city / country 6 / continent : 3
	*
	*/
  MapView.prototype.applyZoomLevel = function(map, mapView) {
    hideImagesInfo(myMapView);

    const currentZoom = getMapZoomLevel(map, mapView);
    const tmp = [];
    tmp.push(mapView.hotPlace[0]);

    let k = 1; // num of items in tmp

    // Define groups
    if ((currentZoom === 3)||(currentZoom === 4)) {
      mapView.Grouplevel = 1;
      if (currentZoom === 3)
        map.setCenter(new google.maps.LatLng(10.377359601358178, 32.71171875000007));
      else if (currentZoom === 4)
        map.setCenter(new google.maps.LatLng(29.207578556055388, -27.053906249999933));
    } else if ((currentZoom === 5)||(currentZoom === 6)) {
      mapView.Grouplevel = 2;
      if (currentZoom === 5)
        map.setCenter(new google.maps.LatLng(44.196205650090825, 19.879687500000063));
      else if (currentZoom === 6)
        map.setCenter(new google.maps.LatLng(50.67924746630975, 7.377246093750065));
    } else {
      mapView.Grouplevel = 3;
      if (currentZoom === 7)
        map.setCenter(new google.maps.LatLng(49.90013595531545, 7.113574218750065));
      else if (currentZoom === 8)
        map.setCenter(new google.maps.LatLng(48.255970240867065, 3.070605468750065));
    }
    // console.log("currentzoom : " + currentZoom + "group level : " + mapView.Grouplevel);

    // Set position for group
    if (mapView.Grouplevel == 1) { // when grouping by continent
      let match = 0;
      for (let i = 0; i < mapView.albumNum; i++) {
        mapView.hotPlace[i].setProperties({visibility: 'visible'});
        mapView.hotPlace[i].coverInfo = createCoverInfoComponent(AlbumData.getInfo(i).continent, 'continent');
        mapView.hotPlace[i].setContent('');

        for (let j = 0; j < k; j++) {
          if (mapView.hotPlace[i].information.continent === tmp[j].information.continent) {
            match++;
          }
        }
        if (match === 0) {
          tmp.push(mapView.hotPlace[i]);
          k++;
        } else {
          match = 0;
        }
      }

      for (let i = 0; i < mapView.albumNum; i++) {
        for (let j = 0; j < k; j++) {
          if (mapView.hotPlace[i].information.continent === tmp[j].information.continent) {
            mapView.hotPlace[i].grouplatlng = tmp[j].latlng;
          }
        }
      }

      mapView.hotplaceNum = k;
    } else if (mapView.Grouplevel == 2) { // when grouping by country
      let match = 0;
      for (let i = 0; i < mapView.albumNum; i++) {
        mapView.hotPlace[i].setProperties({visibility: 'visible'});
        mapView.hotPlace[i].coverInfo = createCoverInfoComponent(AlbumData.getInfo(i).country, 'country');
        mapView.hotPlace[i].setContent('');

        for (let j = 0; j < k; j++) {
          if (mapView.hotPlace[i].information.country === tmp[j].information.country) {
            match++;
          }
        }

        if (match === 0) {
          tmp.push(mapView.hotPlace[i]);
          k++;
        } else {
          match = 0;
        }
      }

      for (let i = 0; i < mapView.albumNum; i++) {
        for (let j = 0; j < k; j++) {
          if (mapView.hotPlace[i].information.country === tmp[j].information.country) {
            mapView.hotPlace[i].grouplatlng = tmp[j].latlng;
          }
        }
      }
      mapView.hotplaceNum = k;
    } else if (mapView.Grouplevel == 3) { // when grouping by city
      let match = 0;
      for (let i = 0; i < mapView.albumNum; i++) {
        mapView.hotPlace[i].setProperties({visibility: 'visible'});
        mapView.hotPlace[i].coverInfo = createCoverInfoComponent(AlbumData.getInfo(i).city, 'city');
        mapView.hotPlace[i].setContent('');

        for (let j = 0; j < k; j++) {
          if (mapView.hotPlace[i].information.city === tmp[j].information.city) {
            match++;
          }
        }

        if (match === 0) {
          tmp.push(mapView.hotPlace[i]);
          k++;
        } else {
          match = 0;
        }
      }

      for (let i = 0; i < mapView.albumNum; i++) {
        for (let j = 0; j < k; j++) {
          if (mapView.hotPlace[i].information.city === tmp[j].information.city) {
            mapView.hotPlace[i].grouplatlng = tmp[j].latlng;
          }
        }
      }
      mapView.hotplaceNum = k;
    }
  }

  /**
	 * @ Get Map's zoom level when the map is initialized or map's zoom level is changed
	 * @private
	 * @param mapView, fade [T/F]
	 */
  MapView.prototype.fadeInOutMap = function(mapView, fade) {
    if (fade) {
      mapView.setMaskSize(mapView, window.innerWidth, window.innerHeight);
      mapView.mask.mod.setTransform(Transform.translate(0, 0, 1), effect_2); // make the mask comes front
      mapView.mask.mod.setOpacity(1, effect_2);
    } else {
      mapView.mask.mod.setOpacity(0, effect_2);
      mapView.setMaskSize(mapView, 0, 0);
      mapView.mask.mod.setTransform(Transform.translate(0, 0, 0), effect_2); // make the mask comes back
    }
  };

  /**
	 * @ Get Map's zoom level when the map is initialized or map's zoom level is changed
	 * @private
	 * @param mapView, size_width, size_height
	 */
  MapView.prototype.setMaskSize = function(mapView, sizeW, sizeH) {
    mapView.mask.mod.sizeFrom(function() {
      return [sizeW, sizeH];
    });
  };

  /**
	 * @param map, mapView,
	 *        effect : image transition effect
	 */
  function loadImages(albumDir, albumData) {
    const tmpImg = new Image();
    tmpImg.src = `${albumDir}/${albumData.continent.replace(/\s+/g, '')}/${albumData.country.replace(/\s+/g, '')}/${albumData.city.replace(/\s+/g, '')}/cover.jpg`;
    tmpImg.onload = function() {
      // console.log(imageNum);
      Engine.emit('image-loaded', tmpImg);
    };
    return tmpImg;
  }

  /**
	 * @param
   * description: description text
   * level: 'continent' || 'country' || 'city'
	 */
  function createCoverInfoComponent(description, level) {
    return `<div class= 'hotPlaceInfo_container'>
              <span class='${level}Info'>${description}</span>
            </div>`;
  }

  function hideImages(mapView) {
    for (let i = 0; i< mapView.albumNum; i++) {
      mapView.hotPlace[i].setProperties({visibility: 'hidden'});
    }
  }

  function hideImagesInfo(mapView) {
    for (let i = 0; i< mapView.albumNum; i++) {
      mapView.hotPlace[i].setContent('');
      mapView.hotPlace[i].mod.setOpacity(0.3);
      mapView.hotPlace[i].setProperties({visibility: 'visible'});
    }
  }

  function showOnlyFrontImages(mapView) {
    for (let i = 0; i< mapView.albumNum; i++) {
      if (mapView.hotPlace[i].latlng === mapView.hotPlace[i].grouplatlng) {
        mapView.hotPlace[i].setContent(mapView.hotPlace[i].coverInfo);
      } else {
        mapView.hotPlace[i].setProperties({visibility: 'hidden'});
      }
    }
  }

  /**
     * @ Mouse click event
     * @private
     * @param mapView
     */
  function mouseClick(mapView) {
    for (let i = 0; i < mapView.albumNum; i++) {
      mapView.hotPlace[i].on('click', function(event) {
        if (mapView.Grouplevel === 2) { // country level
				  selectedSurfaceClick(AlbumData.getInfoByCountry(this.information.country), 'country');
        }

        if (mapView.Grouplevel === 3) {  // city level
          selectedSurfaceClick(AlbumData.getInfoByCity(this.information.city), 'city');
        }
      });
    }
  }

  // go to thumbnail page
  function selectedSurfaceClick(albumData, level) {
    // save object temporary to LocalStorage
    localStorage.setItem('targetAlbum', JSON.stringify(albumData));
    localStorage.setItem('albumLevel', JSON.stringify(level));
    window.location='gallerySection.html';
  }

  module.exports = MapView;
});
