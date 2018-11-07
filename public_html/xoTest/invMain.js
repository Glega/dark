"use strict";

var colors = ['#f00', '#0f0', '#00f','#0ff'];

var canvas = null;
var ctx = null;

var joint = null;

var joints = [];

var targetObject = {};
targetObject.x = 0;
targetObject.y = 0;

var chance = 0;

var totalPopulation = 50;
var otherPopulation = 100;
// All active birds (not yet collided with pipe)
var activePlayers = [];
// All birds for any given population
var allPlayers = [];
// A frame counter to determine when to add a pipe



var oldNNMaxScore = 0;
var bestMaxPF = 0;

var bestMaxScore = 0;
var bestPlayer = null;

var generationVol = 0;
var generationOtherVol = 0

var isPause = false;

var neuroEvol;

var gen;
var alive = 0;
var score = 0;
var scoreDiv; 

var mouseX = 0;
var mouseY = 0;

var mode = "toMove";

var data = [];

var dataCount = 0;

var changePlace = 50;

var superArm;

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

function pause(){
    if(!isPause){
        isPause = true;
    }else{
        isPause = false;
    }

}

function changeMode(m){
	if(m == 1) mode = "toMove";
	if(m == 2) mode = "toRandom";
	if(m == 3) mode = "mouse";
	
}

function main(){
    update(0);	
    requestAnimFrame(main);
}

function init(){	
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 480;
	
	neuroEvol = new Neuroevolution({population:totalPopulation,network:[5, [9,9], 3]});
	
	startInv();
	
	
	for(var i = 0; i < otherPopulation; i++){
		createPlayer();		
	}
	
	targetObject.x = 90;
	targetObject.y = Math.random() * 200;
	scoreDiv = document.getElementById("score");
	
	document.addEventListener('mousemove', onMouseUpdate, false);
	
	superArm = new Arm(ctx);
	
	main();
}


function trainArm(inputs, targets){
	
	superArm.train(inputs, targets);
}

function onMouseUpdate(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
  //console.log(mouseX, mouseY);
}

function startInv(){
	score = 0;
	alive = 0;
	gen = neuroEvol.nextGeneration();
	
	joints = [];
	
	for(var i in gen){
		var player = new Arm(ctx);
		joints.push(player);
	}
	
	//var alive = joints.length;
	
	//targetObject.x = Math.random() * 200 + 10;	
    //targetObject.y = changePlace;//Math.random() * 50 + 10;
	
	generationVol++;
}

function createPlayer(){    
    var player = new Arm(ctx);
    activePlayers.push(player);
    allPlayers.push(player);
	//joints.push(player);
	//console.log(player.fitness);
    return player;
}

function saveData(){
	var file = new Blob([data], {type: "txt"});
	var filename = "angles.raw";
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
	
}


function update(dt) {
	
	if(isPause && dt == 0) return;
	
	chance++;
	
	if (targetObject.x >= 300) {	
		//targetObject.x = 0;   
		//startInv();
		//nextGeneration();
		targetObject.x = 60;
		chance = 0;
		changePlace += 1;
    }
	
	if(mode == "toMove"){
	
		targetObject.x += 1;// Math.random() * changePlace + 50;	
		targetObject.y = changePlace;//Math.random() * changePlace + 50;
		
	}else if(mode == "toRandom"){
		
		targetObject.x = Math.random() * 250 + 50;	;//mouseX;// 
		targetObject.y = Math.random() * 250 + 50;	;
		
	}else if(mode == "mouse"){
		targetObject.x = mouseX;
		targetObject.y = mouseY;
		
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    
	var tempBestPlayer = bestPlayer;
    var tempHighScore = 0;
	/*
	for(var n = 0; n < allPlayers.length; n++){
		allPlayers[n].think(targetObject);
		//allPlayers[n].render();
		var s = allPlayers[n].score;
		if (s > oldNNMaxScore) {
        oldNNMaxScore = s;
        bestPlayer = allPlayers[n];
        }	
	}
	*/
	
	var maxPF = 0;
	var lastLive = 0;
	
	
	
	for(var i = 0; i < joints.length; i++){
		
		if(joints[i].alive){	
			
			maxPF += joints[i].thinkEvolve(gen[i], targetObject);			
			if(joints[i].alive == false) alive++;		
			//joints[i].showError(targetObject);
			neuroEvol.networkScore(gen[i], score);
			lastLive = i;
		}
		//joints[i].render();
		var s = score;
		if (s > tempHighScore) {
        tempHighScore = s;
        //tempBestPlayer = joints[1];
		
		
		
        }	
	}
	
	superArm.think(targetObject);
	superArm.render();
	
	if(alive >= totalPopulation){
		//console.log("Next");
		
		alive = 0;		
		startInv();
		
	}else{	
	 score++;
	}
	
	
	if(score > 200) changePlace += 1;
	
	if(changePlace > 200) changePlace = 50;
	
	if(maxPF > bestMaxPF) bestMaxPF = maxPF;
	
	scoreDiv.innerHTML = "Generation:" + generationVol + " / " + generationOtherVol + "; score = "+ tempHighScore + "/" + bestMaxScore + "; maxPF:" + maxPF + "/" + bestMaxPF + "; Last alive: " + lastLive + "<br>Data vol: " + dataCount;
  
	//console.log(score);
	if(bestPlayer != null){
		//bestPlayer.render();
		//bestPlayer.showError(targetObject);
	}
	
	if(tempHighScore > bestMaxScore){
	  bestMaxScore = tempHighScore;
	  bestPlayer = tempBestPlayer;
	  //brainAgainstPlayer = bestPlayer;
	}
	
	
	
	ctx.beginPath();
	ctx.arc(targetObject.x, targetObject.y, 10,0,2*Math.PI);
	ctx.fillStyle = "blue";
	ctx.fill();
	ctx.stroke();
	//nextGeneration();
}
