(function(){
	
	var ctx;
	var canvas;
	var renderObjects = [];
	var backgroundColor = 0x000000;
	var eventListeners = {};
	
    function Stage(canvas, ctx){
	    this.canvas = canvas;
		this.ctx = ctx;		
	
    } 

    Stage.prototype = {
	    clear: function(){		   
			this.ctx.fillStyle = backgroundColor;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	    },
		
		addEventListener: function(target, event, f){			
			if(!eventListeners[event]){
				//eventListeners[event] = {};
				//eventListeners[event].objects = [];
			}						
			//var id = target.depth;			
			//eventListeners[event].objects[id] = target;	
			
		},
		
		runEventToAll: function(e){
			//if(!eventListeners[e.id]) return;
			
			var objects = renderObjects;		
				
			for(var key in objects){
				var o = objects[key];
				e.target = o;
				if(!o.handlers[e.id]) continue;
				o.handlers[e.id].handler.call(this, e);
			}
		},
		
		removeChild: function(child){			
			var index = child.depth;
			renderObjects.splice(index, 1);	
			for(var i = index - 1; i < renderObjects.length;i++){
				renderObjects[i].depth = i;
			}
			//console.log(renderObjects);
		},
		
		/*
		Определяем событие по области 
		
		*/
		
		checkEvent: function(e){
			//if(!eventListeners[e.id]) return;
			
			var objects = renderObjects;
			var checkedObjects = {};
			
					
			for(var key in objects){
				var o = objects[key];
				if(!o.handlers[e.id]) continue;
				if(e.mouseX > o.x && e.mouseY > o.y && e.mouseX < o.x + o.width && e.mouseY < o.y + o.height) checkedObjects[o.depth] = o;
			}
						
			if(Object.keys(checkedObjects).length == 0) return;
						
			var index = Object.keys(checkedObjects)[Object.keys(checkedObjects).length - 1];
			
			var obj = checkedObjects[index];						
			var event = {target: obj, event: e};			
			e.target = obj;						
			obj.handlers[e.id].handler.call(this, e);			
		},
		
		addChild: function(displayObject){
			
			if(displayObject.bitmap == null){
				console.log(displayObject + ": Cannot load image");
				return;
			}
			
			renderObjects.push(displayObject);
			displayObject.depth = renderObjects.length - 1;
			displayObject.parent = this;
			
		},
		
		swapChildIndex: function(index, target){
			
			if(index == target) return;
			
			var obj = renderObjects[target];
			renderObjects[target] = renderObjects[index];
			renderObjects[target].depth = target;
			renderObjects[index] = obj;
			renderObjects[index].depth = index;
			
		},
		
		setChildLastIndex: function(child){
			this.swapChildIndex(child.depth, renderObjects.length - 1);			
		},
		
	   	update: function(){
			this.clear();
			for(var i = 0; i < renderObjects.length; i++){
				if(renderObjects[i] == undefined) continue;
				renderObjects[i].render(this.ctx);			
			}
		}		
    }
   
   window.Stage = Stage;
})();

