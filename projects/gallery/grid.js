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

