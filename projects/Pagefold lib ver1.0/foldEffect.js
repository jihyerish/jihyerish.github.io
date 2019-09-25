var frontRotate = -179;	//[0, -179]
var backRotate = 179;		//[179, 0]
//var perspective;


var marginTop;
var height;
var width;
var articleSrc;
var imgSrc;

var FOLD = {
	
	initEffect: function(object, img){
		
		//initEffect inputParameter : <content id> <cover id>
		
		//get article content source
		articleSrc = object.getAttribute("src");
		
		//get cover image
		if (img != null)
			imgSrc = img.getAttribute("src");
		else	//default image
			imgSrc = "http://www.cornerstone-digital.com.au/images/blog/good-news-headline.jpg";
			
		
		width = parseInt(object.getAttribute("width"));
		height = parseInt(object.getAttribute("height"));
		marginTop = height / 3.0;
		
		//console.log(height);
		
		object.style.position = "absolute";
		object.style.top = "-"+marginTop+"px";
		object.style.left = "50px";
		
		
		////////////////////////////////////////////////////////////////////
		//Create(content child);
		
		// create Cover Div elements <div>
        var coverDiv = document.createElement("div");
		coverDiv.id = "coverSection";
		coverDiv.style.backgroundColor = "white";
		coverDiv.style.textAlign = "center";
		coverDiv.style.display = "block";
		coverDiv.style.paddingTop = "5px";
		coverDiv.style.paddingBottom = "5px";
		coverDiv.height = ""+(marginTop);
		coverDiv.width = ""+width;

			// contents creation for Cover Div
           	var cover_img = document.createElement("img");
			cover_img.src = imgSrc
			cover_img.height = ""+(marginTop);
			coverDiv.appendChild(cover_img);
					
		object.appendChild(coverDiv);
        
		// create Article Div elements <div>		
        var articleDiv = document.createElement("div");
		articleDiv.id = "articleSection";
		articleDiv.style.backgroundColor = "white";
		articleDiv.style.textAlign = "center";
		articleDiv.style.display = "block";
		coverDiv.style.paddingTop = "5px";
		coverDiv.style.paddingBottom = "5px";
		articleDiv.height = ""+(marginTop*2);
		articleDiv.width = ""+width; 
		
			// contents creation for Article Div
			var articlePage = document.createElement("iframe");
			articlePage.src = articleSrc;
			articlePage.height = ""+(marginTop*2);			
			articlePage.width = ""+width;
			articleDiv.appendChild(articlePage);
		
        object.appendChild(articleDiv);
		////
		//show cover section
		//Ready for applying folding effect
		object.style.webkitFilter = "custom(url(oneSide/fold.vs) mix(url(oneSide/fold.fs) normal source-atop), 50 50 border-box, transformFront perspective(3000px) rotateX(-179deg),transformBack perspective(3000px) rotateX(179deg), shadow 1.4, useColoredBack 1)";	
		//
	},
	
	//onesideEffect inputParameter : <content id> , <effect duration> , <perspective>
	onesideEffect: function(object, duration, perspective){		
		object.style.webkitTransition =  "-webkit-filter "+duration+"s ease-in-out";
				
		object.onmouseover = function() {
			this.style.webkitFilter = "custom(url(oneSide/fold.vs) mix(url(oneSide/fold.fs) normal source-atop), 50 50 border-box, transformFront perspective("+perspective+"px) rotateX(0deg),transformBack perspective("+perspective+"px) rotateX(179deg), shadow 2, useColoredBack 0)";	
		};
		
		object.onmouseout = function() {			
			this.style.webkitFilter = "custom(url(oneSide/fold.vs) mix(url(oneSide/fold.fs) normal source-atop), 50 50 border-box, transformFront perspective("+perspective+"px) rotateX(-179deg),transformBack perspective("+perspective+"px) rotateX(179deg), shadow 1.4, useColoredBack 1)";
		};
		
		
	},
	
	//bothsidesEffect inputParameter : <content id> , <effect duration> , <perspective>
	bothsidesEffect: function(object, duration, perspective){
		object.style.webkitTransition = "-webkit-filter "+duration+"s ease-in-out";
		
		object.onmouseover = function() {			
			this.style.webkitFilter = "custom(url(twoSide/fold.vs) mix(url(twoSide/fold.fs) normal source-atop), 50 50 border-box, transformFrontUp perspective("+perspective+"px) rotateX(0deg),transformFrontDn perspective("+perspective+"px) rotateX(0deg),transformBack perspective(3000px) rotateX(179deg),shadow 2, useColoredBack 0)";
		};
		
		object.onmouseout = function() {			
			this.style.webkitFilter = "custom(url(twoSide/fold.vs) mix(url(twoSide/fold.fs) normal source-atop), 50 50 border-box, transformFrontUp perspective("+perspective+"px) rotateX(-88deg),transformFrontDn perspective("+perspective+"px) rotateX(88deg),transformBack perspective(3000px) rotateX(179deg),shadow 1.4, useColoredBack 1)";
		};
				
	}
};