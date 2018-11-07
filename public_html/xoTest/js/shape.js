(function(){
	
   var bitmap = null;
   var handlers;
   	    
   function Shape(){
		this.handlers = {};
   } 

   Shape.prototype = {
		addImage: function(img){
			this.bitmap = img;	
		},
		
		addEventListener: function(e, f){
			this.parent.addEventListener(this, e);
			
			this.handlers[e] = {};
			this.handlers[e].handler = f;
		},
		
		setMaxDepth: function(){
			this.parent.setChildLastIndex(this);
		},
		
		render: function(ctx){
			if(this.bitmap.bitmapData == null) return;
			
			ctx.beginPath();
			ctx.lineWidth="1";
			ctx.strokeStyle="green";
			ctx.rect(this.x, this.y, this.width, this.height);
			ctx.stroke();
			
			ctx.drawImage(this.bitmap.bitmapData, 0, 0, this.bitmap.bitmapData.width, this.bitmap.bitmapData.height, this.x, this.y, this.width, this.height);
		},
		
		remove: function(){
			this.parent.removeChild(this);
		}
   }
   
   Shape.prototype.x = 0;
   Shape.prototype.y = 0;
   Shape.prototype.width = 100;
   Shape.prototype.height = 100;
   Shape.prototype.depth = 0;
   Shape.prototype.parent = null;
   
   window.Shape = Shape;
})();

