function mutate(x) {
  if (Math.random(1) < 0.1) {
    let offset = randn_bm() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

(function(){
    
   function Arm(ctx, brain){	 
   
	 if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    } else {	  
      this.brain = new NeuralNetwork(5, 200, 3);
    }
	
     this.graphics = ctx;   
	 this.fitness = 0;
	 this.joints = [];
	 this.score = 0.1;
	 this.joint = new Joint(ctx);
	 this.joint.x = 200; this.joint.y = 200;
	 this.joint.radius = 20;
	 this.joint.boneWidth = 100;
	
	 this.joint2 = new Joint(ctx);
	 this.joint2.radius = 25;
	 this.joint2.boneWidth = 100;
	
	 this.joint3 = new Joint(ctx);
	 this.joint3.radius = 20;
	 this.joint3.boneWidth = 50;
	
	 this.joint.addChild(this.joint2);
	 this.joint2.addChild(this.joint3);
	
	 this.joints.push(this.joint);
	 this.joints.push(this.joint2);
	 this.joints.push(this.joint3);
	 
	 this.alive = true;
	 
   } 

   Arm.prototype = {   	
        
        render: function(){
			
			if(!this.alive) return;
			
			for(var i = 0; i < this.joints.length; i++){
				this.joints[i].render();
			}
			
        },
		
		think: function(targetObject){
		
			
			for(var i = 0; i < this.joints.length; i++){
				this.joints[i].updatePosition();
			}
			
			
			
			var dx = targetObject.x - this.joint3.x;
			var dy = targetObject.y - this.joint3.y;
			
			var dr = Math.sqrt(dx * dx + dy * dy);
			
			var inputs = [];
			inputs.push(this.joint.angle / 360 * 0.99 + 0.01);
			inputs.push(this.joint2.angle / 360 * 0.99 + 0.01);
			inputs.push(this.joint3.angle / 360 * 0.99 + 0.01);	
			
			inputs.push(targetObject.x / 512 * 0.99 + 0.01);
			inputs.push(targetObject.y / 480 * 0.99 + 0.01);
			
			//inputs.push(dr / 300 * 0.99 + 0.01);
			
			//console.log(inputs);
			
			
			//inputs.push(this.joint3.x / 512 * 0.99 + 0.01);
			//inputs.push(this.joint3.y / 480 * 0.99 + 0.01);
			/*
			inputs.push(this.joint2.x / offSetPosition * 0.99 + 0.01);
			inputs.push(this.joint2.y / offSetPosition * 0.99 + 0.01);
			
			inputs.push(this.joint.x / offSetPosition * 0.99 + 0.01);
			inputs.push(this.joint.y / offSetPosition * 0.99 + 0.01);
			//*/
			//console.log(inputs);
			
			var action = this.brain.predict(inputs);
			
			this.joint.angle = action[0] * 360;
			this.joint2.angle = action[1] * 360;
			this.joint3.angle = action[2] * 360;
			
			//this.joint3.angle = action[2] * 360;
			
			for(var i = 0; i < this.joints.length; i++){
				this.joints[i].updatePosition();
			}
			
			
			dx = targetObject.x - this.joint3.x;
			dy = targetObject.y - this.joint3.y;
			
			dr = Math.sqrt(dx * dx + dy * dy);
			
			//console.log(dr);
			
			if(dr < 1) dr = 1;
			
			if(dr < 10){
				this.score += 10;
				//data.push([action[0], action[1], action[2]]);
				//console.log(data);
			}
			
			//this.score = 1000 - dr;
			
		},
		
		train: function(inputs, targets){
			this.brain.train(inputs, targets);			
		},
		
		thinkEvolve: function(neuroEvol_, target_){	
			
			for(var i = 0; i < this.joints.length; i++){
				this.joints[i].updatePosition();
			}
			
			var inputs = [];
			inputs.push(this.joint.angle / 360 * 0.99 + 0.01);
			inputs.push(this.joint2.angle / 360 * 0.99 + 0.01);
			inputs.push(this.joint3.angle / 360 * 0.99 + 0.01);	
			
			inputs.push(target_.x / 512 * 0.99 + 0.01);
			inputs.push(target_.y / 480 * 0.99 + 0.01);
			
			var jointAngle1 = this.joint.angle / 360 * 0.99 + 0.01;
			var jointAngle2 = this.joint2.angle / 360 * 0.99 + 0.01;
			var jointAngle3 = this.joint3.angle / 360 * 0.99 + 0.01;
			
			var prevData = (target_.x / 512 * 0.99 + 0.01) + "_" + (target_.y / 512 * 0.99 + 0.01) + "_" + jointAngle1 + "_" + jointAngle2 + "_" + jointAngle3;
			
			//inputs.push(this.joint.x / 512 * 0.99 + 0.01);
			//inputs.push(this.joint.y / 480 * 0.99 + 0.01);
			
			//inputs.push(this.joint2.x / 512 * 0.99 + 0.01);
			//inputs.push(this.joint2.y / 480 * 0.99 + 0.01);
			
			//inputs.push(this.joint3.x / 512 * 0.99 + 0.01);
			//inputs.push(this.joint3.y / 480 * 0.99 + 0.01);
						
			var action = neuroEvol_.compute(inputs);
			
			
			
			this.joint.angle = action[0] * 360;
			this.joint2.angle = action[1] * 360;
			this.joint3.angle = action[2] * 360;
			
			for(var i = 0; i < this.joints.length; i++){
				this.joints[i].updatePosition();
			}
			
			//console.log(this.joint3.x + " + " + this.joint3.y);
			
			var dx = target_.x - this.joint3.x;
			var dy = target_.y - this.joint3.y;
			
			var dr = Math.sqrt(dx * dx + dy * dy);
			
			if(dr < 1) dr = 1;
			
			
			
			if(dr < 10){
				//console.log("DR = " + dr);
				var angles = action[0] + "_" + action[1] + "_" + action[2];
				//console.log("DR = " + angles);
				//data.push(prevData + "_" + angles);
				//dataCount++;
				trainArm(inputs, [action[0], action[1], action[2]]);
				return 1;
			}else{
				this.alive = false;
				return 0;
				
			}
				
			//this.score = 1000 - dr;
		}, 
		
		copy: function() {
			return new Arm(this.graphics, this.brain);
		},
		
		showError: function(targetObject){
			var ctx = this.graphics;			
			
			var dx = targetObject.x - this.joint3.x;
			var dy = targetObject.y - this.joint3.y;
			
			var dr = Math.sqrt(dx * dx + dy * dy);
			
			//if(dr < 100) console.log(dr);
			
			var ang = this.joint3.angle * Math.PI / 180;
			
			ctx.beginPath();
			ctx.moveTo(this.joint3.x,this.joint3.y);
			ctx.lineTo(targetObject.x, targetObject.y);
			ctx.strokeStyle = colors[2]; //цвет линии    
			ctx.lineWidth = 1;//толщина линии		
			ctx.stroke();
		}
        
   }
   
   window.Arm = Arm;
})();