function getImages(dirName) {
    
    //passsing directoryPath and callback function
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", dirName, false ); // false for synchronous request
    xmlHttp.send( null );
    var ret=xmlHttp.responseText;
    var fileList=ret.split('\n');
    for(i=0;i<fileList.length;i++){
        var fileinfo=fileList[i].split(' ');
        if ( fileinfo[0] == "201:" ) {
            //document.write(fileinfo[1]+"<br />");
            //document.write("<img src=\""+directory+fileinfo[1]+"\" />");
            console.log(fileinfo[1]);
        }
    }
}

function loadImages(container, dirName, fileNameArray) {
    for (let imageNum = 0; imageNum < fileNameArray.length; imageNum++) {
        container.appendChild(createImageElement(dirName+fileNameArray[imageNum]+'.jpg', 'grid-image'));

    //var img2 = document.createElement('amp-img'); // Use DOM HTMLImageElement
    //img2.src = dirName + fileName[imageNum] + '.jpg';
    //img2.className = 'grid-image';
    //img2.setAttribute('layout', 'fixed');
    //container.appendChild(img2);
    }
}

function createImageElement(src, class_name) {
    let image = document.createElement('img');
    image.src = src;
    image.className = class_name;
    return image;
}

// TODO: Using scroll-snap. More natural transition
function handleGesture(imageList, targetIndex) {
    if (touchendX <= touchstartX) {
      // Swiped left: Previous image
      console.log('Swiped left');
      if (targetIndex > 0) {
        imageList[targetIndex].style.display = 'none';
        detailTargetIndex = targetIndex - 1;

        imageList[detailTargetIndex].style.objectFit = 'contain';
        imageList[detailTargetIndex].style.display = 'block';
        return true;
      }
    }

    if (touchendX >= touchstartX) {
      // Swiped right: Next image
      console.log('Swiped right');
      if (targetIndex < imageList.length - 1) {
        imageList[targetIndex].style.display = 'none';
        detailTargetIndex = targetIndex + 1;

        imageList[detailTargetIndex].style.objectFit = 'contain';
        imageList[detailTargetIndex].style.display = 'block';
        return true;
      }
    }

    return false;
}

function readyForGridLayout(header, imageElements, footer) {
    document.body.style.backgroundColor = 'white';

    const headerTitle = header.querySelector('#text');
    const closeBtn = header.querySelector('#closeButton');
    closeBtn.style.display = 'none';
    header.className = 'header header-grid';
    headerTitle.innerText = 'Image gallery';
    headerTitle.style.color = '#303030';

    footer.style.display = 'none';

    imageElements.forEach(image => {
      image.style.display = 'block';
      image.style.objectFit = 'cover';
    });

    return new Promise(function (resolve) {
      resolve();
    });
}

function readyForDetailLayout(header, imageElements, footer, target) {
    document.body.style.backgroundColor = 'black';

    const headerTitle = header.querySelector('#text');
    const closeBtn = header.querySelector('#closeButton');
    closeBtn.style.display = 'block';
    header.className = 'header header-detail';
    headerTitle.innerText = (target.src.split(dirName)[1]).split('.')[0];
    headerTitle.style.color = '#E8E8E8';

    footer.style.display = 'flex';

    let targetIndex = null;

    imageElements.forEach((image, index) => {
      if (image == target) {
        image.style.objectFit = 'contain';
        targetIndex = index;
      }
      else {
        image.style.display = 'none';
      }
    });

    return new Promise(function (resolve) {
      resolve(targetIndex);
    });
}
