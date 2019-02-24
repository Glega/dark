(function(){
	
   var text = "";
   var handlers;
   var bitmap = "Text";
   	    
   function TextField(){
		this.handlers = {};
   } 

   TextField.prototype = {		
		
		addEventListener: function(e, f){
			this.parent.addEventListener(this, e);
			
			this.handlers[e] = {};
			this.handlers[e].handler = f;
		},
		
		setMaxDepth: function(){
			this.parent.setChildLastIndex(this);
		},
		
		setText: function(txt){
			this.text = txt;
		},

		getText: function(){
		    return this.text;
		},
		
		render: function(ctx){
			ctx.fillStyle = "#FFF";
			ctx.font = "italic 30pt Arial";
			ctx.fillText(this.text, this.x + 60, this.y - 10);
		},
		
		remove: function(){
			this.parent.removeChild(this);
		}
   }
   
   
   TextField.prototype.x = 0;
   TextField.prototype.y = 0;
   window.TextField = TextField;
})();

