

	function bind(func, context) {
		return function() { // (*)
			return func.apply(context, arguments);
		};
	}

	var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
	})();



	function main(){

		var bg = boomer.add.image("/img/wall.jpg");
		bg.width = 800;
		bg.height = 600;
		bg.addEventListener("mousedown", function(e){
			console.log("it is BG!!!");
		});
		update();

	}

	function update(){
		boomer.update();
		requestAnimFrame(update);
	}

	function SimpleShape(){
		this.x = 0;
		this.y = 0;

		this.dx = 0;
		this.dy = 0;
		this.width = 0;
		this.height = 0;

		this.lastX = 0;
		this.lastY = 0;

		this.drag = false;
		this.shape = null;

		this.removeFromStage = function(){
			this.shape.remove();
		}

		this.init = function(imageID, width, height){
			var shape = boomer.add.image(imageID);
			shape.width = width;
			shape.height = height;
			this.width = width;
			this.height = height;
			this.shape = shape;
			var inst = this;

			shape.addEventListener("mousedown", function(e){
				inst.lastX = e.target.x;
				inst.lastY = e.target.y;

				e.target.width += 20;
				e.target.height += 20;
				e.target.x -= 10;
				e.target.y -= 10;
				inst.x = e.target.x;
				inst.y = e.target.y;

				inst.dx = inst.x - e.mouseX;
				inst.dy = inst.y - e.mouseY;
				inst.drag = true;

			});

			shape.addEventListener("mouseup", function(e){
				inst.drag = false;
				e.target.width = inst.width;
				e.target.height = inst.height;

				e.target.x = inst.lastX;
				e.target.y = inst.lastY;
				inst.x = e.target.x;
				inst.y = e.target.y;

			});

			shape.addEventListener("mousemove", function(e){

				if(!inst.drag) return;
				e.target.x = e.mouseX + inst.dx;
				e.target.y = e.mouseY + inst.dy;
				inst.x =e.target.x;
				inst.y =e.target.y;
				inst.lastX = e.target.x + 10;
				inst.lastY = e.target.y + 10;
			});
		}

	}