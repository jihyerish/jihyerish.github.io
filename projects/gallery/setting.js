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

    return new Promise(function (resolve) {
      resolve();
    });
}

function createImageElement(src, class_name) {
    let image = document.createElement('img');
    image.src = src;
    image.className = class_name;
    return image;
}

// TODO: Using scroll-snap. More natural transition
function handleGesture(imageList, targetIndex, startPos, endPos) {
  
  if (endPos.x < startPos.x) {
    // Swiped left: Next image
    if (targetIndex + 1 <= imageList.length - 1) {
      if (targetIndex >= 1) {
        imageList[targetIndex - 1].style.display = 'none';
        imageList[targetIndex - 1].style.left = 0;
        imageList[targetIndex - 1].style.transform = 'translateX(0)';
      }

      targetIndex++;

      imageList[targetIndex - 1].style.display = 'block';
      imageList[targetIndex - 1].style.left = `${-window.innerWidth}px`;
      imageList[targetIndex - 1].style.transform = 'translateX(0)';        

      imageList[targetIndex].style.left = '0px';
      imageList[targetIndex].style.transform = 'translateX(0)';        

      if (targetIndex + 1 <= imageList.length - 1) {
        imageList[targetIndex + 1].style.display = 'block';
        imageList[targetIndex + 1].style.left = `${window.innerWidth}px`;
        imageList[targetIndex + 1].style.transform = 'translateX(0)'; 
      }

      return targetIndex;
    }      
  }

  if (endPos.x > startPos.x) {
    // Swiped right: Previous image
    if (targetIndex - 1 >= 0) {
      if (targetIndex + 1 <= imageList.length - 1) {      
        imageList[targetIndex + 1].style.display = 'none';
        imageList[targetIndex + 1].style.left = 0;
        imageList[targetIndex + 1].style.transform = 'translateX(0)'; 
      }

      targetIndex--;

      if (targetIndex >= 1) {
        imageList[targetIndex - 1].style.display = 'block';
        imageList[targetIndex - 1].style.left = `${-window.innerWidth}px`;
        imageList[targetIndex - 1].style.transform = 'translateX(0)';     
      }   

      imageList[targetIndex].style.left = '0px';
      imageList[targetIndex].style.transform = 'translateX(0)';
      
      imageList[targetIndex + 1].style.display = 'block';
      imageList[targetIndex + 1].style.left = `${window.innerWidth}px`;
      imageList[targetIndex + 1].style.transform = 'translateX(0)';
      
      return targetIndex;
    }
  }

  return -1;
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
      image.className = 'grid-image';
    });

    return new Promise(function (resolve) {
      resolve();
    });
}

function readyForDetailLayout(header, container, imageElements, footer, target) {
    document.body.style.backgroundColor = 'black';
    const headerTitle = header.querySelector('#text');
    const closeBtn = header.querySelector('#closeButton');
    closeBtn.style.display = 'block';
    header.className = 'header header-detail';
    headerTitle.innerText = getFileName(target);
    headerTitle.style.color = '#E8E8E8';

    footer.style.display = 'flex';

    let targetIndex = null;

    imageElements.forEach((image, index) => {
      image.className = 'detail-image';
      if (image == target) {        
        targetIndex = index;
        image.style.display = 'block';
        image.style.transform = `translateX(0px)`;
      }
      else {
        image.style.display = 'none';
      }
    });

    container.className = 'detail-layout';

    if (targetIndex >= 1) {
      imageElements[targetIndex - 1].style.display = 'block';
      imageElements[targetIndex - 1].style.left = `${-window.innerWidth}px`;
    }

    if (targetIndex < imageElements.length - 1) {
      imageElements[targetIndex + 1].style.display = 'block';
      imageElements[targetIndex + 1].style.left = `${window.innerWidth}px`;
    }

    return new Promise(function (resolve) {
      resolve(targetIndex);
    });
}

function getFileName(imgElement) {
  let fileName = imgElement.src.replace(/^.*(\\|\/|\:)/, '');
  return fileName[0].toUpperCase().concat(fileName.substr(1)).split('.')[0];
}
