/* eslint-disable require-jsdoc */
/*
 * Gallery Demo - Home section
 ver 0.2
 * created by Jihye Hong (LG Elec. SWP. WMT team)
*/

define(function(require) {
  // import dependencies
  const Engine = require('famous/core/Engine');
  const Scene = require('famous/core/Scene');
  const Surface = require('famous/core/Surface');
  const ImageSurface = require('famous/surfaces/ImageSurface');
  const ContainerSurface = require('famous/surfaces/ContainerSurface');
  const Modifier = require('famous/core/Modifier');
  const StateModifier = require('famous/modifiers/StateModifier');
  const Scrollview = require('famous/views/Scrollview');
  const Utility = require('famous/utilities/Utility');
  const ScrollContainer = require('famous/views/ScrollContainer');
  const Lightbox = require('famous/views/Lightbox');
  const Transform = require('famous/core/Transform');
  const Easing = require('famous/transitions/Easing');
  const Transitionable = require('famous/transitions/Transitionable');
  const SnapTransition = require('famous/transitions/SnapTransition');
  const SpringTransition = require('famous/transitions/SpringTransition');
  const TransitionableTransform = require('famous/transitions/TransitionableTransform');

  const EventHandler = require('famous/core/EventHandler');
  const ScrollSync = require('famous/inputs/ScrollSync');
  const MouseSync = require('famous/inputs/MouseSync');
  const KeyCodes = require('famous/utilities/KeyCodes');
  const Random = require('famous/math/Random');
  const RenderNode = require('famous/core/RenderNode');

  const FamousPhysicsEngine = require('famous/physics/PhysicsEngine');
  const Spring = require('famous/physics/forces/Spring');
  const Snap = require('famous/physics/constraints/Snap');
  const Particle = require('famous/physics/bodies/Particle');
  const Vector = require('famous/math/Vector');

  const AlbumData = require('../src/album_data');
  const mainContext = Engine.createContext();
  const PhysicsEngine = new FamousPhysicsEngine();

  // load images
  const albumNum = 10;  // Show top 10 albums in the home view
  const screenPerspective = 10000; // 이 값이 z축으로 +되면 object는 시야에서 사라짐
  const zTransScale = 2;
  const scrollLimit = screenPerspective * zTransScale;
  let albumCovers = [];
  const imgDir = '../src/images/';

  // position info
  const randomPosition = [];
  const paddingH = window.innerHeight / 8;
  const paddingW = window.innerWidth / 10;
  const zRangeALayerFromOrigin = 5000;
  const zIntervalBimages = zRangeALayerFromOrigin / (albumNum);

  // Effects
  const scrollSync = new ScrollSync(function() {
    return [0, 0];
  });
  const scrollSnaptransition = {
    method: 'snap',
    period: 500,
    dampingRatio: .8,
    velocity: 0,
  };
  // mouse effect duration
  const mouseEffectD = 700;
  // for mouse selected effect
  // Create snaps that will act on the particle
  const snaps = [];
  const spring = new Snap({
    anchor: [0, 0, 0],
    period: 500,
    dampingRatio: 0.2,
    length: 0,
  });
  const snapg = new Snap({
    anchor: [0, 0, 0],
    period: mouseEffectD,
    dampingRatio: 0.2,
    length: 0,
  });
  const zBouncing = 10000;
  const particles = [];
  // Create snaptransitionable
  const transitionable = new Transitionable(0);
  Transitionable.registerMethod('snap', SnapTransition);
  const sumPos = 0;

  const transitionableMatrix = new Transitionable(Transform.identity);
  const transitionableMatrix1 = new Transitionable(Transform.identity);
  const transitionableMatrix2 = new Transitionable(Transform.identity);

  const transitionableZ1 = new Transitionable(0);
  const transitionableY1 = new Transitionable(0);
  const transitionableZ2 = new Transitionable(0);
  const transitionableY2 = new Transitionable(0);

  let transMatrix = Transform.identity;
  const old_transMatrix = Transform.identity;
  const new_transMatrix = Transform.identity;
  const old_transMatrix1 = Transform.identity;
  const new_transMatrix1 = Transform.identity;
  const old_transMatrix2 = Transform.identity;
  const new_transMatrix2 = Transform.identity;
  // With key down action
  let minSurfaceZvalue;
  let maxSurfaceZvalue;
  const rotationDegree = 0;
  const TransInfos = [];

  // Create a grouop of scene
  const SceneLayer = new Scene({
    id: 'root',
    origin: [0.5, 0.5],
    transform: [{translate: [0, 0, 0]}],
    opacity: 1,
    target: [
      {
        origin: [0.5, 0.5],
        transform: [
          {translate: [0, 0, 0]},
        ],
        target: {id: 'layer1'},
      },
      {
        origin: [0.5, 0.5],
        transform: [
          {translate: [0, 0, 0]},
        ],
        target: {id: 'layer2'},
      },
    ],
  });
  let albumCoversScene1 = undefined;

  // Getting scrollInput
  Engine.pipe(scrollSync);

  loadAlbumCovers(albumNum);

  function createImageSurface(albumInfo) {
    return new Promise((resolve) => {
      const image = new ImageSurface({opacity: 0.6});
      image.img = new Image();
      image.img.src = `${imgDir}/${albumInfo.continent.replace(/\s+/g, '')}/${albumInfo.country.replace(/\s+/g, '')}/${albumInfo.city.replace(/\s+/g, '')}/cover.jpg`;
      image.addClass('home-cover');
      
      image.img.onload = () => resolve({image, status: true});
      image.img.onerror = () => resolve({image, status: false});
    });
  }

  function loadAlbumCovers(albumNum) {
    // TODO: Show top most album (Don't show all)
    // How to decide top most?
    const topNInfo = AlbumData.getTopN(albumNum);
    const createdPromise = [];
    for (let i = 0; i < topNInfo.length; i++) {
      createdPromise.push(createImageSurface(topNInfo[i]));
    }

    Promise.all(createdPromise).then((loadedImageSurfaces) => {
      albumCovers = loadedImageSurfaces.filter((obj) => obj.status).map((filteredObj) => filteredObj.image);
    }).then((resolve) => {
      for (let i = 0; i < albumNum; i++) {
        albumCovers[i].setContent(albumCovers[i].img.src);
        albumCovers[i].setSize([albumCovers[i].img.width / 2, albumCovers[i].img.height / 2]);
        albumCovers[i].img = null;
      }

      setRandomPosition();
      placeImageSurfaces();
      createEffects();
      startEffect();

      document.querySelector('.loading-panel').style.display = 'none';
    });
  }

  function setRandomPosition() {
    // z interval between images = zRangeALayerFromOrigin / (albumNum + 1)
    // console.log("width : "+window.innerWidth+", height : "+window.innerHeight);
    for (let i = 0, tmp; i < albumNum; i++) {
      tmp = new Array(3);
      if (i % 4 === 0) {
        // multiply 5 because of z-axis value
        tmp[0] = Random.integer(-window.innerWidth / 2 + paddingW * 3, -paddingW * 2);
        tmp[1] = Random.integer(-window.innerHeight / 2 + paddingH * 3, paddingH * 2);
      } else if (i % 4 === 1) {
        // multiply 5 because of z-axis value
        tmp[0] = Random.integer(-paddingW * 2, window.innerWidth / 2 - paddingW * 3);
        tmp[1] = Random.integer(-window.innerHeight / 2 + paddingH * 3, -paddingH * 2);
      } else if (i % 4 === 2) {
        // multiply 5 because of z-axis value
        tmp[0] = Random.integer(paddingW * 2, window.innerWidth / 2 - paddingW * 3);
        tmp[1] = Random.integer(-paddingH * 2, window.innerHeight / 2 - paddingH * 3);
      } else if (i % 4 === 3) {
        // multiply 5 because of z-axis value
        tmp[0] = Random.integer(-window.innerWidth / 2 + paddingW * 3, paddingW * 2);
        tmp[1] = Random.integer(paddingH * 2, window.innerHeight / 2 - paddingH * 3);
      }
      randomPosition.push(tmp);
    }

    // With key down action
    minSurfaceZvalue = randomPosition[9][2];
    maxSurfaceZvalue = randomPosition[0][2];

    for (let i = 0; i < albumNum; i++) {
      TransInfos[i] = {};
      TransInfos[i].zDegrees = randomPosition[i][2];
      TransInfos[i].yDegrees = randomPosition[i][1];
      TransInfos[i].zToggle = 1;
      TransInfos[i].yToggle = 1;
      TransInfos[i].btnToggle = 1;
    }
  }

  function placeImageSurfaces() {
    const sceneTargets = [];

    for (let i = 0; i < albumNum; i++) {
      randomPosition[i][2] = - zIntervalBimages * i;
    }
    const opacityInterval = 1.0 / albumNum;

    // Create a scene of album covers
    for (let i = 0; i < albumNum; i++) {
      const obj = {
        id: `cover${i}mod`,
        origin: [0.5, 0.5],
        transform: [
          {translate: [randomPosition[i][0], randomPosition[i][1], randomPosition[i][2]]},
        ],
        target: {id: `cover${i}`},
      };
      sceneTargets.push(obj);

      albumCovers[i].modifier = new Modifier({
        origin: [0.5, 0.5],
        opacity: getOpacityValue(randomPosition[i][2])
      });
    }

    albumCoversScene1 = new Scene({
      id: 'root',
      origin: [0.5, 0.5],
      opacity: 1,
      target: sceneTargets,
    });
    // Create a modifier for each scene
    albumCoversScene1.modifier = new Modifier({origin: [0.5, 0.5], opacity: 1});
  }

  //* ****** Image show effect ****************************************
  // Create physical objects for bouncing
  // Create a physical particle with position (p), velocity (v), mass(m)
  function createEffects() {
    for (let i = 0, initBounce = 4.6; i < albumNum; i++) {
      const tmpParticle = new Particle({
        mass: 1,
        position: [0, 0, zIntervalBimages * initBounce],
        velocity: [0, 0, 0],
      });
      particles.push(tmpParticle);

      initBounce -= 0.5;
      if (initBounce < 2) initBounce = 4.6;
    }

    for (let i = 1; i <= albumNum; i++) {
      const periodVal = ((i % 2) === 0) ? 500 : 600;
      const tmpSnap = new Snap({
        anchor: [0, 0, 0],
        period: periodVal, // <= Play with these values :-)
        dampingRatio: 0.2, // <= if 0 then just once / else if 1 then infinite
        length: 0,
      });
      snaps.push(tmpSnap);
    }

    particles.forEach((particle, index) => {
      PhysicsEngine.attach(snaps[index], particle);
      PhysicsEngine.addBody(particle);
    });
  }

  function startEffect() {
    SceneLayer.modifier = new Modifier({origin: [0.5, 0.5], opacity: 1});

    albumCovers.forEach((album, index) => {
      const idString = `cover${index}`;
      albumCoversScene1.id[idString].add(album.modifier).add(particles[index]).add(album);
    });

    SceneLayer.id['layer1'].add(albumCoversScene1.modifier).add(albumCoversScene1);
    mainContext.add(SceneLayer.modifier).add(SceneLayer);

    mainContext.setPerspective(screenPerspective);

    // interaction effect

    // var yTransInterval = 5; //이미지 로테이션 효과 시 y축으로 이동하는 정도
    const yTransInterval = 2.5; // 이미지 로테이션 효과 시 y축으로 이동하는 정도
    const zTransInterval = zIntervalBimages / 10; // 이미지 로테이션 효과 시 z축으로 이동하는 정도

    const zIntervalfromOrigin = 1000; // 하나의 scene레이어와 origin 사이의 거리

    Engine.on('keydown', function(event) {
      // Up & Down arrow : archor effect
      if (event.which == KeyCodes['UP_ARROW']) { // layer1 = -z, layer2 = +z
        // y : start : layer1 = -y, layer2 = +y
        // y : meet z = 0 : layer1 = +y, layer2 = -y

        for (let i = 0; i < albumNum; i++) {
          if ((TransInfos[i].zDegrees > maxSurfaceZvalue) || (TransInfos[i].zDegrees < minSurfaceZvalue)) {
            TransInfos[i].zToggle *= -TransInfos[i].btnToggle;
          }
          if (TransInfos[i].zDegrees == minSurfaceZvalue / 2) {
            TransInfos[i].yToggle *= -TransInfos[i].btnToggle;
          }

          TransInfos[i].zDegrees -= (zTransInterval * TransInfos[i].zToggle);
          TransInfos[i].yDegrees = TransInfos[i].yDegrees + yTransInterval * (-TransInfos[i].yToggle);

          albumCovers[i].modifier.setTransform(
              Transform.multiply(albumCovers[i].modifier.getFinalTransform(),
                  Transform.translate(0, yTransInterval * (-TransInfos[i].yToggle), -(zTransInterval * TransInfos[i].zToggle))));

          albumCovers[i].modifier.setOpacity(getOpacityValue(TransInfos[i].zDegrees));
        }
      } else if (event.which == KeyCodes['DOWN_ARROW']) { // layer1 = -z, layer2 = +z
        // y : start : layer1 = -y, layer2 = +y
        // y : meet z = 0 : layer1 = +y, layer2 = -y
        for (let i = 0; i < albumNum; i++) {
          if ((TransInfos[i].zDegrees > maxSurfaceZvalue) || (TransInfos[i].zDegrees < minSurfaceZvalue)) {
            TransInfos[i].zToggle *= -TransInfos[i].btnToggle;
          }
          if (TransInfos[i].zDegrees == minSurfaceZvalue / 2) {
            TransInfos[i].yToggle *= -TransInfos[i].btnToggle;
          }

          TransInfos[i].zDegrees += (zTransInterval * TransInfos[i].zToggle);
          TransInfos[i].yDegrees = TransInfos[i].yDegrees + yTransInterval * (TransInfos[i].yToggle);

          albumCovers[i].modifier.setTransform(
              Transform.multiply(albumCovers[i].modifier.getFinalTransform(),
                  Transform.translate(0, yTransInterval * (TransInfos[i].yToggle), (zTransInterval * TransInfos[i].zToggle))));

          albumCovers[i].modifier.setOpacity(getOpacityValue(TransInfos[i].zDegrees));
        }
      } else if (event.which == KeyCodes['LEFT_ARROW']) {
        for (let i = 0; i < albumNum; i++) {
          TransInfos[i].zDegrees += zTransInterval;
          let opacityValueForSurface = getOpacityValue(TransInfos[i].zDegrees);
          if (opacityValueForSurface > 1) {
            opacityValueForSurface = 0.99;
          }

          albumCovers[i].modifier.setOpacity(opacityValueForSurface);
          albumCovers[i].modifier.setTransform(
              Transform.multiply(albumCovers[i].modifier.getFinalTransform(),
                  Transform.translate(0, 0, zTransInterval)));
        }
      } else if (event.which == KeyCodes['RIGHT_ARROW']) {
        for (let i = 0; i < albumNum; i++) {
          TransInfos[i].zDegrees -= zTransInterval;
          let opacityValueForSurface = getOpacityValue(TransInfos[i].zDegrees);

          if (opacityValueForSurface > 1) {
            opacityValueForSurface = 0.99;
          }

          albumCovers[i].modifier.setOpacity(opacityValueForSurface);
          albumCovers[i].modifier.setTransform(
              Transform.multiply(albumCovers[i].modifier.getFinalTransform(),
                  Transform.translate(0, 0, -zTransInterval)));
        }
      } else if (event.which == KeyCodes['ENTER']) {
        PhysicsEngine.detachAll();
        particles.forEach((particle) => {
          PhysicsEngine.attach(snapg, particle);
          PhysicsEngine.addBody(particle);
        });

        particles[0].applyForce(new Vector(0, 0, 0.5));
        particles[1].applyForce(new Vector(-0.025, 0, 0.5));
        particles[2].applyForce(new Vector(0, -0.025, 0.5));
        particles[3].applyForce(new Vector(0, 0.025, 0.5));
        particles[4].applyForce(new Vector(0.025, 0, 0.5));

        particles[5].applyForce(new Vector(0.025, 0.025, -0.5));
        particles[6].applyForce(new Vector(0.025, 0, -0.5));
        particles[7].applyForce(new Vector(0, 0.025, -0.5));
        particles[8].applyForce(new Vector(0, -0.025, -0.5));
        particles[9].applyForce(new Vector(-0.025, 0, -0.5));
      }
    });

    SceneLayer.modifier.transformFrom(function() {
      transMatrix = transitionableMatrix.get();
      // transMatrix = Transform.multiply4x4(transMatrix, transitionableMatrix.get()); : 이거 하면 무한 반복!! 노노 안됨
      return transMatrix;
      // return Transform.multiply4x4(transMatrix, Transform.translate(0,0,2000))
    });

    albumCoversScene1.modifier.transformFrom(function() {
      return Transform.multiply(Transform.translate(0, 0, zIntervalfromOrigin), transitionableMatrix1.get());
    });

    //* ****** Image Mouse over effect ****************************************
    // using 'mouseover' event on each surface
    let currentTrans; let currentFrontTrans; let makeResetTrans; let makeFrontTrans; let makeOriginTrans; const currentTransInv = Transform.identity;
    let prevTrans;
    const prevNum1imgTrans = Transform.identity;
    let translateValue;
    let prevNum1imgPos;
    let prevSelectedImgId = -1;
    let prevSelectedPosId = -1;
    const maxZvalue = 2000;
    const vectorValue =
			[{x: 0.2, y: 0, z: 0},
			  {x: -0.2, y: -0.2, z: 0},
			  {x: 0.2, y: -0.2, z: 0},
			  {x: 0.2, y: 0.2, z: 0},
			  {x: -0.2, y: 0.2, z: 0},
			  {x: 0.5, y: 0.5, z: 0},
			  {x: -0.5, y: 0, z: 0},
			  {x: 0, y: -0.5, z: 0},
			  {x: 0.5, y: 0, z: 0},
			  {x: 0, y: 0.5, z: 0}
			];

    albumCovers.forEach((targetAlbumCover) => {
      targetAlbumCover.on('click', function() {
        const indexNum = albumCovers.indexOf(this);
        document.querySelector('.selected-info').innerText = `${AlbumData.getInfo(indexNum).city}`;

        if (this.classList.includes('selected-cover')) {
          selectedSurfaceClick(AlbumData.getInfo(indexNum).city);
        } else {
          for (let i = 0; i < albumNum; i++) {
            if (i === indexNum) {
              albumCovers[i].addClass('selected-cover');
            } else {
              albumCovers[i].removeClass('selected-cover');
            }
          }

          this.modifier.setOpacity(1);

          PhysicsEngine.detachAll();
          particles.forEach((particle) => {
            PhysicsEngine.attach(spring, particle);
          });

          currentTrans = albumCoversScene1.id['cover' + indexNum + 'mod'].getFinalTransform();
          makeOriginTrans = Transform.multiply(Transform.translate(0, 0, 0), Transform.inverse(currentTrans));
          makeFrontTrans = Transform.multiply(makeOriginTrans, Transform.translate(0, 0, maxZvalue)); // always set image to (0, 0, maxZ)

          if (prevSelectedImgId >= 0) {
            currentFrontTrans = albumCoversScene1.id['cover' + prevSelectedImgId + 'mod'].getFinalTransform();
            makeOriginTrans = Transform.multiply(albumCovers[prevSelectedImgId].modifier.getFinalTransform(), Transform.translate(0, 0, -maxZvalue));
            makeResetTrans = Transform.multiply(makeOriginTrans, currentFrontTrans);
            albumCovers[prevSelectedImgId].modifier.setTransform(makeResetTrans,
                {duration: mouseEffectD, curve: Easing.outElastic});
            albumCovers[prevSelectedImgId].modifier.setOpacity(getOpacityValue(randomPosition[prevSelectedImgId][2]));
          }

          albumCovers[indexNum].modifier.setTransform(makeFrontTrans, {duration: mouseEffectD, curve: Easing.outElastic});

          particles.forEach((particle, index) => {
            if (index !== indexNum) {
              particle.applyForce(new Vector(vectorValue[index % 10].x, vectorValue[index % 10].y, vectorValue[index % 10].z));
            }
          });

          prevSelectedPosId = prevSelectedImgId;
          prevSelectedImgId = indexNum;
        }
      });
    });
  }

  // go to thumbnail page
  function selectedSurfaceClick(cityName) {
    // save object temporary to LocalStorage
    localStorage.setItem('targetAlbum', JSON.stringify(AlbumData.getInfoByCity(cityName)));
    localStorage.setItem('albumLevel', null);
    window.location='gallerySection.html';
  }

  function getOpacityValue(zDegree) {
    return 1 + zDegree / 5000;
  }
});
