(function(){
	
   var bitmap = null;
   var frameWidth = 0;
   var frameHeight = 0;
   var posX = 0;
   var posY = 0;
   var handlers;
   var pause = false;
   var startTime = 0;
   var fps = 0;
   	    
   function Sprite(){
		this.handlers = {};
   } 

   Sprite.prototype = {
		addImage: function(img){
			this.bitmap = img;	
		},
		
		init: function(config){
			this.frameWidth = config.width;
			this.frameHeight = config.height;
			this.posX = config.x;
			this.posY = config.y;	
			this.pause = config.pause;
			this.startTime = new Date().getTime();
			this.fps = 100;
		},
		
		addEventListener: function(e, f){
			this.parent.addEventListener(this, e);
			
			this.handlers[e] = {};
			this.handlers[e].handler = f;
		},
		
		setMaxDepth: function(){
			this.parent.setChildLastIndex(this);
		},
		
		setPosY: function(y){
			this.posY = y;
		},
		
		render: function(ctx){
			if(this.bitmap.bitmapData == null) return;
			
			var dx = this.posX * this.frameWidth;
			var dy = this.posY * this.frameHeight;
			
			/*
			ctx.beginPath();
			ctx.lineWidth="1";
			ctx.strokeStyle="green";
			ctx.rect(this.x, this.y, this.width, this.height);
			ctx.stroke();
			*/
			ctx.drawImage(this.bitmap.bitmapData, dx, dy, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height);
			
			if(this.pause) return;
			
			if(this.fps > new Date().getTime() - this.startTime) return;
			
			
			this.startTime = new Date().getTime();
			
			this.posX += 1;
			
			if(this.posX * this.frameWidth >= this.bitmap.bitmapData.width) this.posX = 0;
			
		},
		
		remove: function(){
			this.parent.removeChild(this);
			if(this.handlers["remove"]) this.handlers["remove"].handler.call(this, {target: this});
			delete(this);
		}
   }
   
   Sprite.prototype.x = 0;
   Sprite.prototype.y = 0;
   Sprite.prototype.width = 100;
   Sprite.prototype.height = 100;
   Sprite.prototype.depth = 0;
   Sprite.prototype.parent = null;
   
   window.Sprite = Sprite;
})();

