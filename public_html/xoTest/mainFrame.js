

var isDebug = false;

var cats = 0;
var aiWins = 0;
var neuroEvolutionWins = 0;
var maxCoeff = 0;
var maxCats = 0;

var brainAgainstPlayer = null;

var UserBrainWins = 0;
var NeuroEvolutionWins = 0;

var bestMaxScore = 0;

var maxPopulation = 300;

var roundArena = Math.floor(Math.log(maxPopulation)/Math.log(2));
console.log("Max Round = " + roundArena);

var maxRounds = roundArena;
var bestPlayer = null;

let totalPopulation = maxPopulation;
// All active birds (not yet collided with pipe)
let activePlayers = [];
// All birds for any given population
let allPlayers = [];
// A frame counter to determine when to add a pipe
let counter = 0;

var generationVol = 0;
var isPause = false;
var bestPlayers = [];

var nextRoundPlayers = [];

var genPlayers = [];

var tables = [];
var arena = null;

var TT = [0,0,0,0,0,0,0,0,0];
var Tturns = [1,1,1,1,1,1,1,1,1];
var Tround = 0;
var TcurrentPlayer = 0;
var Tgame = true;
var TstartPlayer = 0;

function nextPlayer(){
	brainAgainstPlayer = allPlayers[getRandomInt(0, allPlayers.length - 1)];
	
}

function Trestart(){
	TT = [0,0,0,0,0,0,0,0,0];
    Tturns = [1,1,1,1,1,1,1,1,1];
	Tround = 0;
	Tgame = true;
	for(var i = 0; i < 3; i++){
		for(var j = 0; j < 3; j++){
			var tr = document.getElementById(i + "_" + j);
			tr.innerHTML = "";
			
		}
	}
	
	
	
	if(TstartPlayer == 0){
		TstartPlayer = 1;
	}else{
		TstartPlayer = 0;
	}
	
	TcurrentPlayer = TstartPlayer;
	
	
	if(TcurrentPlayer == 1){		
		Tthink();
	}
	
}

function TgetCellPosition(pos){
   var unitposition = Math.floor((pos - 1) / 3);
   var posX = pos - 3 * unitposition;
   posX = posX - 1;
   //console.log(posX + " - pos x" + " pos y = " + unitposition);
   return unitposition.toString() + "_" + posX.toString();
}

function Tthink(){
	if(brainAgainstPlayer == null) return;
	var check = brainAgainstPlayer.think(TT, Tturns, Tround);
	
	Tturn(check);
}

function Tturn(cell){
	if(!Tgame) return;

	if(cell < 0){
		console.log("Кто то мудак!");
		Tgame = false;
		return;
	}
	
	if(brainAgainstPlayer == null){
		console.log("Мозги не найдены");
		return;
	}
	
	if(Tturns[cell] == 0){
		console.log("Return from line 100");
		return;
	}
	
	var id = TgetCellPosition(cell + 1);
	console.log("cell id = " + id);
	
	Tturns[cell] = 0;
	Tround++;
	var tr = document.getElementById(id);
	
	
	var tempPlayer = TcurrentPlayer;
	var nextPlayer = 1;
	
	if(TcurrentPlayer == 0){
		tr.innerHTML = "O";
		TT[cell] = 1;
		//TcurrentPlayer = 1;
		//Tthink();
		//return;
	}else{
		TT[cell] = -1;
		tr.innerHTML = "X";
		nextPlayer = 0;
	}
	var win = checkBoard(TT);
	
	console.log(win + "; r = " + Tround);
	
	if(win){
		console.log("Win " + tempPlayer);
		//Trestart();
		if(tempPlayer == 0) UserBrainWins++;
		else NeuroEvolutionWins++;
		Tgame = false;		
		return;
	}
	
	if(Tround == 9){
		console.log("Cats");
		Tgame = false;		
		return;
	}
	
	TcurrentPlayer = nextPlayer;
	if(nextPlayer == 1) Tthink();
	
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

    update(0);
	
    requestAnimFrame(main);
}

function init(){
	var ai = new Ai("random");
	console.log(ai.toString());
	main();
}


function setup() {
  arena = document.getElementById("arena");
  

  for (let i = 0; i < totalPopulation; i++) {
    var tbl = new Table();
    tables.push(tbl);
    
	var player1 = createPlayer();	
	var player2 = new Ai("asd");
	//player2.init();
    tbl.addPlayer(player1);
    tbl.addPlayer(player2);
  }
}

function createPlayer(){    
    var player = new Player();
    activePlayers.push(player);
    allPlayers.push(player);
    return player;
}


function update(dt) {

  if(isPause && dt == 0) return;

  
  
  if (activePlayers.length == 0) {	
		//debug("Next generation");
		//console.log(activePlayers);
		    
        nextGeneration();
		
        //setup();
  }

  

  var isGame = false;

  for (let i = tables.length - 1; i >= 0; i--) {
        let table = tables[i];
        isGame = table.turn();
  }
  checkScore();	
  checkLoser();
  

  // If we're out of birds go to the next generation

}
function checkLoser(){
	for (let i = 0; i < activePlayers.length; i++) {
      var lose = activePlayers[i].lose;
	  if(lose) activePlayers.splice(i, 1);
	}
	
}

function checkScore(){
  let tempBestPlayer = bestPlayer;
  var tempHighScore = 0;
  for (let i = 0; i < activePlayers.length; i++) {
      let s = activePlayers[i].score;
      if (s > tempHighScore) {
        tempHighScore = s;
        tempBestPlayer = activePlayers[i];
      }
  }
  
  //brainAgainstPlayer = tempBestPlayer;
  
  //if(bestPlayers.length < 100) bestPlayers.push(bestPlayer);
  
  var scoreDiv = document.getElementById("score");
  var bestPlayerId = 0;
  if(bestPlayer != null) bestPlayerId = bestPlayer.id;

  if(tempHighScore > bestMaxScore){
	  bestMaxScore = tempHighScore;
	  bestPlayer = tempBestPlayer;
	  //brainAgainstPlayer = bestPlayer;
  }
  var coeff = 0;
  if(aiWins > 0) coeff = (neuroEvolutionWins / aiWins);
  if(coeff > maxCoeff) maxCoeff = coeff;
  if(cats > maxCats) maxCats = cats;

  scoreDiv.innerHTML = "Generation:" + generationVol + "; score = "+ tempHighScore + "/" + bestMaxScore + "; Human VS Machine: " + UserBrainWins + ":" + NeuroEvolutionWins + "; Population: " + activePlayers.length + "/" + maxPopulation +  "<br> wl:" + coeff.toString().substr(0, 4) + "/" + maxCoeff.toString().substr(0, 4) +  ";<br> cats:" + cats + "/" + maxCats;
  //console.log(allPlayers[0].brain.weights_ho.data[0][1]);
	
}


function pause(){
    if(!isPause){
        isPause = true;
    }else{
        isPause = false;
    }

}

function getCellPosition(pos){
   var unitposition = Math.floor((pos - 1) / 3);
   var posX = pos - 3 * unitposition;
   posX = posX - 1;
   //console.log(posX + " - pos x" + " pos y = " + unitposition);
   return posX.toString() + "_" + unitposition.toString();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function debug(obj){
	
	if(!isDebug) return;
	
	console.log(obj);
	
}

function userClick(element){
	//console.log(element.id);
	var s = element.id.split("_");
	var posX = parseInt(s[0]);
	var posY = parseInt(s[1]);
	
	var pos = posX * 3 + posY;
	//console.log(pos);
	Tturn(pos);
	
}