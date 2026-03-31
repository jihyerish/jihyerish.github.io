define(function(require, exports, module) {
  const Engine = require('famous/core/Engine');
  const Surface = require('famous/core/Surface');
  const Flipper = require('famous/views/Flipper');
  const Modifier = require('famous/core/Modifier');
  const Transform = require('famous/core/Transform');
  const ImageSurface = require('famous/surfaces/ImageSurface');

  const SpringTransition = require('famous/transitions/SpringTransition');
  const SnapTransition = require('famous/transitions/SnapTransition');
  const TransitionableTransform = require('famous/transitions/TransitionableTransform');
  const Transitionable = require('famous/transitions/Transitionable');
  const AlbumData = require('../src/album_data');

  const imgDir = '../src/images/';
  const targetAlbum = JSON.parse(localStorage.getItem('targetAlbum')) || {city: 'Vienna', country: 'AUSTRIA', continent: 'EUROPE'};
  const albumLevel = JSON.parse(localStorage.getItem('albumLevel')) || 'city';

  const mainContext = Engine.createContext();
  mainContext.setPerspective(1000);

  Transitionable.registerMethod('Spring', SpringTransition);

  const transition = {
    method: 'Spring',
    period: 1200,
    dampingRatio: .6,
    velocity: 0.000001,
  };

  const transitionLong = {
    method: 'Spring',
    period: 1500,
    dampingRatio: .6,
    velocity: 0.000001,
  };

  const lightBoxes = [];
  const cube_width = 250;
  const cube_height = 200;
  const original_width = 375;
  const original_height = 300;
  const w_margin = 270;
  const h_margin = 220;

  loadTitle(targetAlbum, albumLevel);
  loadAlbum(targetAlbum, albumLevel);

  function loadTitle(targetAlbum, albumLevel) {
    if (albumLevel === 'city') {
      document.querySelector('.album_info').innerText = `${targetAlbum.city}, ${targetAlbum.country}`;
    }
    if (albumLevel === 'country') {
      document.querySelector('.album_info').innerText = `${targetAlbum[0].country}`;
    }
  }

  function createImageSurface(idx) {
    return new Promise((resolve) => {
      lightBoxes = {};
      lightBoxes.toggle = false;
      lightBoxes.flipper = new Flipper();

      lightBoxes.frontSurface = new ImageSurface({
        size: [cube_width, cube_height],
        properties: {
          backgroundImage: `url('${imgDir}/${targetAlbum.continent}/${targetAlbum.country}/${targetAlbum.city}/thumbnails/${idx + 1}.jpg')`,
        }
      });

      lightBoxes.backSurface = new ImageSurface({
        size: [original_width, original_height],
        content: `${imgDir}/${targetAlbum.continent}/${targetAlbum.country}/${targetAlbum.city}/${idx + 1}.jpg`,
      });

      lightBoxes.onload = () => resolve({lightBoxes, status: true});
      lightBoxes.onerror = () => resolve({lightBoxes, status: false});
    });
  }

  function loadAlbum(targetData, albumLevel) {
    if (albumLevel === 'city') {
      loadImages(targetData, targetData.imageNumber);
    }
    if (albumLevel === 'country') {
      let imageNumberSum = 0;
      for (let i = 0; i < targetData.length; i++) {
        imageNumberSum += targetData[i].imageNumber;
        loadImages(targetData[i], imageNumberSum);
      }
    }
  }

  function loadImages(album, imageNumberSum) {
    // Image number and display data
    const totalImageNumber = album.imageNumber;
    const column = 4;
    let first_index = 0;
    const row = (totalImageNumber / column);
    const prevRow = Math.ceil((imageNumberSum - totalImageNumber) / column);

    for (let k = 0; k < row; k++) {
      for (let i = first_index; i < (first_index + column); i++) {
        const idx_column = i % column;
        const idx_row = k + prevRow;
        const lightBox = {};
        lightBox.toggle = false;
        lightBox.flipper = new Flipper();

        const imageUrl = `${imgDir}/${album.continent.replace(/\s+/g, '')}/${album.country.replace(/\s+/g, '')}/${album.city.replace(/\s+/g, '')}/thumbnails/${i + 1}.jpg`;
        //let preloaderImg = document.createElement("img");
        //preloaderImg.src = imageUrl;

        lightBox.frontSurface = new Surface({
          size: [cube_width, cube_height],
          properties: {
            backgroundImage: `url(${imageUrl})`,
          }
        });
        //preloaderImg = null;

        lightBox.backSurface = new Surface({
          size: [original_width, original_height],
          properties: {
            backgroundImage: `url('${imgDir}/${album.continent.replace(/\s+/g, '')}/${album.country.replace(/\s+/g, '')}/${album.city.replace(/\s+/g, '')}/${i + 1}.jpg')`,
          }
        });

        lightBox.frontSurface.addClass('front-surface');
        lightBox.backSurface.addClass('back-surface');

        lightBox.flipper.row = idx_row;
        lightBox.flipper.column = idx_column;
        lightBox.flipper.setFront(lightBox.frontSurface);
        lightBox.flipper.setBack(lightBox.backSurface);

        lightBox.centerModifier = new Modifier({origin: [.5, .5]});
        lightBox.centerModifier.setTransform(
            Transform.translate(w_margin * (idx_column + 1) - 600, h_margin * idx_row - h_margin + 50, 0)
        );

        mainContext.add(lightBox.centerModifier).add(lightBox.flipper);

        lightBox.frontSurface.index = lightBoxes.length;
        lightBox.frontSurface.mod = lightBox.centerModifier;

        lightBox.backSurface.index = lightBoxes.length;
        lightBox.backSurface.mod = lightBox.centerModifier;

        lightBoxes.push(lightBox);

        surfaceClick(lightBox.frontSurface, lightBoxes, column);
        surfaceClick(lightBox.backSurface, lightBoxes, column);

        if ((i + 1) === totalImageNumber) break;
      }

      first_index = first_index + column;
    }
  }

  function surfaceClick(surface, lightBoxes, column) {
    surface.on('click', function() {
      const effect_1 = {curve: 'easeOutBounce', duration: 900};
      const effect_2 = {curve: 'easeOutBounce', duration: 600};

      const lightbox = lightBoxes[this.index];

      lightbox.flipper.setAngle((lightbox.toggle ? 0 : Math.PI*1.2), effect_1);

      if (!lightbox.toggle) {
        surface.mod.setTransform(Transform.translate(0, 0, 250), effect_1);

        for (let p=0; p < lightBoxes.length; p++) {
          if (p !== this.index) {
            lightBoxes[p].frontSurface.mod.setTransform(Transform.translate(w_margin * (lightBoxes[p].flipper.column + 1) - 600, h_margin * lightBoxes[p].flipper.row - h_margin + 50, -450), transition);
            lightBoxes[p].frontSurface.mod.setOpacity(0.4);
          }
        }
      } else {
        surface.mod.setTransform(
            Transform.translate(w_margin * (lightbox.flipper.column + 1) - 600, h_margin * lightbox.flipper.row - h_margin + 50, 0),
            effect_1
        );
        for (let p=0; p < lightBoxes.length; p++) {
          if (p !== this.index) {
            lightBoxes[p].frontSurface.mod.setTransform(Transform.translate(w_margin * (lightBoxes[p].flipper.column + 1) - 600, 
                                                        h_margin * lightBoxes[p].flipper.row - h_margin + 50, 0), 
                                                        effect_2);
            lightBoxes[p].frontSurface.mod.setOpacity(1);
          }
        }
      }
      lightbox.flipper.setAngle((lightbox.toggle ? 0 : Math.PI), effect_1);
      lightbox.toggle = !lightbox.toggle;
    });
  }

  window.addEventListener('load', () => {
    document.querySelector('.loading-panel').style.display = 'none';
  });
});
