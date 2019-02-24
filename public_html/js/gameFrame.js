var dudes = 0;
var dudesArray = {};

function addDude(id){

    if(dudesArray[id]){
        console.log("Dude exist");
        return;
    }

    dudesArray[id] = {};


}

function drawDudes(){
    dudes = 0;

    for(var key in dudesArray){
       var dude = boomer.add.image("/img/dude.png");
       dude.x = 240 * dudes;
       dude.y = 350;

       dude.width = 220;
       dude.height = 220;
       dudesArray[key].src = dude;
       dudes++;

       var msg = boomer.add.text();
       msg.setText(key);
       dude.addChild(msg);
       console.log("Text = " + msg.getText());

    }
}




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



        drawDudes();
        showUI();
		update();
	}

	function update(){
		boomer.update();
		requestAnimFrame(update);
	}

	function showUI(){
	    var exitButton = boomer.add.sprite("/img/exit_button.png");
        		exitButton.width = 100;
                exitButton.height = 100;
                exitButton.init({
                    width: 100,
                    height: 100,
                    x:0,
                    y:0,
                    pause: true
                });

                exitButton.addEventListener("mousedown", function(e){

                    exitRoom();
                });

                exitButton.addEventListener("mousemove", function(e){
                    var dx = e.target.x - e.mouseX;
                    var dy = e.target.y - e.mouseY;

                    if(Math.abs(dx) < 100 && Math.abs(dy) < 100) e.target.setPosY(1);
                    else e.target.setPosY(0);

                });

	    var playButton = boomer.add.sprite("/img/play_button.png");
        		playButton.width = 500;
                playButton.height = 220;
                playButton.x = 100;
                playButton.y = 200;
                playButton.init({
                    width: 500,
                    height: 220,
                    x:0,
                    y:0,
                    pause: true
                });

                playButton.addEventListener("mousedown", function(e){
                    e.target.remove();
                    joinGame();
                });

                playButton.addEventListener("mousemove", function(e){
                    var dx = e.mouseX - e.target.x;
                    var dy = e.mouseY - e.target.y;

                    if(dx < 500 && dy < 220 && dx > 0 && dy > 0) e.target.setPosY(1);
                    else e.target.setPosY(0);

                });
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