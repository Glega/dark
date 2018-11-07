(function(){
	
	var canvas;
	var ctx;
	var loader;
	var testImage;
	var bmp1;
	var stage;
	
	var mousePos;
	
	
	var standartConfig = {
		width: 800,
		height: 600,
		container: null
	}
	
    
   function Boomer(config){
	   
	if(config == undefined){ 
		config = standartConfig;
		config.container = document.body;		
	}else{
		config.container = document.getElementById(config.container);
	}
		
    canvas = document.createElement("canvas");
	
	config.container.appendChild(canvas);
	
	ctx = canvas.getContext("2d");
	canvas.width = config.width;
	canvas.height = config.height; 
	console.log("Hi");
	
	stage = new Stage(canvas, ctx);
	stage.clear();
	
	loader = new Loader();	
	
	var b = this;
	
	mousePos = {x:0, y:0};
	
	canvas.addEventListener("mousedown", function(e){
		var mousePos = b.getMousePosition(canvas, e);
		stage.checkEvent({id: "mousedown", mouseX: mousePos.x, mouseY: mousePos.y});
		
	});
	
	canvas.onmouseup = function(e){
		var mousePos = b.getMousePosition(canvas, e);
		stage.runEventToAll({id: "mouseup", mouseX: mousePos.x, mouseY: mousePos.y});
		
	};
	
	canvas.addEventListener("mousemove", function(e){		
		mousePos = b.getMousePosition(canvas, e);
		stage.runEventToAll({id: "mousemove", mouseX: mousePos.x, mouseY: mousePos.y});
		//stage.checkEvent({id: "mousemove", mouseX: mousePos.x, mouseY: mousePos.y});		
	});
	
   } 

   Boomer.prototype = {
	   
		getMousePosition: function(target, e){
			var rect = target.getBoundingClientRect();
			return {x :e.clientX - rect.left,  y:e.clientY - rect.top};
		},
	   
		loadImages: function(arr){// load array of images
			loader.loadImages(arr);
		},
		
		setLoadImagesHandler: function(f){//Set function which call, when all images loaded
			loader.setHandler(f);
		},
		
		add: {//add objects to stage
			image: function(id){
				var shape = new Shape();
				shape.addImage(loader.getImage(id));
				stage.addChild(shape);
				return shape;
			},
			sprite: function(id){
				//console.log("Add Sprite")
				var sprite = new Sprite();
				sprite.addImage(loader.getImage(id));
				stage.addChild(sprite);
				return sprite;
			}			
		},
		
		update: function(){			
			stage.runEventToAll({id: "update", mouseX: mousePos.x, mouseY: mousePos.y});
			stage.update();
		}  
   }
   
   
   window.Boomer = Boomer;
})();

