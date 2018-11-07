

(function(){
    
   function Joint(ctx){	 
     this.graphics = ctx;   
     this.child = null;
	 this.x = 0;
	 this.y = 0;
	 this.radius = 0;
	 this.angle = Math.random() * 360;
	 this.boneWidth = 0;
	 this.parentJoint = null;
     //console.log("Joint created...");
   } 

   Joint.prototype = {    
	    
        addChild: function(joint){		  
          this.child = joint;
		  joint.parentJoint = this;
		  
        },
        
        getChildAt: function(){
          return this.child;
        },
		
		updatePosition: function(){
			if(this.parentJoint == null) return;
			
			var ang = this.parentJoint.angle * Math.PI / 180;
			this.x = this.parentJoint.x + Math.cos(ang) * this.parentJoint.boneWidth;
			this.y = this.parentJoint.y + Math.sin(ang) * this.parentJoint.boneWidth;
			
		},
        
        render: function(){
			
			var ctx = this.graphics;
			
			this.updatePosition();
			
			
            ctx.beginPath();
	        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
	        ctx.fillStyle = "red";
	        ctx.fill();
	        ctx.stroke();
			
			var ang = this.angle * Math.PI / 180;
			
			
			
			ctx.beginPath();
			ctx.moveTo(this.x,this.y);
			ctx.lineTo(this.x + Math.cos(ang) * this.boneWidth, this.y + Math.sin(ang) * this.boneWidth);
			ctx.strokeStyle = colors[1]; //цвет линии    
			ctx.lineWidth = 1;//толщина линии		
			ctx.stroke();
			
        }
        
   }
   
   window.Joint = Joint;
})();