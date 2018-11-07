var ID = 0;

function checkBoard(field){
	var winner = false;
	var winnerMarker = -1;

	var col0 = field[0] + field[1] + field[2];
	var col1 = field[3] + field[4] + field[5];
	var col2 = field[6] + field[7] + field[8];

	var row0 = field[0] + field[3] + field[6];
	var row1 = field[1] + field[4] + field[7];
	var row2 = field[2] + field[5] + field[8];

	var ang1 = field[0] + field[4] + field[8];
	var ang2 = field[2] + field[4] + field[6];

	if(col0 == -3 || col1 == -3 || col2 == -3 || row0 == -3 || row1 == -3 || row2 == -3 || ang1 == -3 || ang2 == -3) return true;
	if(col0 == 3 || col1 == 3 || col2 == 3 || row0 == 3 || row1 == 3 || row2 == 3 || ang1 == 3 || ang2 == 3) return true;

	return false;

}

class Table{

constructor(){

this.id = ID;
//console.log("Table id:" + this.id);
ID++;

this.xPlayer = null;
this.oPlayer = null;
this.startGame = false;
this.currentPlayer = null;
this.field = [0,0,0,0,0,0,0,0,0];
this.turns = [1,1,1,1,1,1,1,1,1];
this.tableBody = null;
this.createGraph(this.id);
this.endGame = false;
this.round = 0;
this.startPlayer = 0;

}

addBrain(player){
  this.xPlayer = player;	
  this.startGame = true;
}


addPlayer(player){
    if(this.xPlayer == null){
        this.xPlayer = player;
        this.xPlayer.marker = "X";
    }else{
        this.oPlayer = player;
        this.oPlayer.marker = "O";
        
		this.startGame = true;
		this.endGame = false;
    }
	
	if(Math.random() < 0.5) this.startPlayer = 1;
	else this.startPlayer = 0;
	
	if(this.startPlayer == 0) this.currentPlayer = this.xPlayer;
	else this.currentPlayer = this.oPlayer;
	
}

reset(){
	//this.startGame = false;
	this.oPlayer.init();
	this.round = 0;
	this.updateGraph();
	this.endGame = false;
	this.tableBody.style.backgroundColor = "#ffffff";
	this.field = [0,0,0,0,0,0,0,0,0];
	this.turns = [1,1,1,1,1,1,1,1,1];
	this.xPlayer.imFirst = 0;
	
	if(this.startPlayer == 0) this.startPlayer = 1;
	else this.startPlayer = 0;
	
	if(this.startPlayer == 0) this.currentPlayer = this.xPlayer;
	else this.currentPlayer = this.oPlayer;
	
}

turn(){	
	if(this.endGame) return;
    //console.log("Turn");
    var check = this.currentPlayer.think(this.field, this.turns, this.round);
	//console.log("Check = " + check);
	if(check < 0){
		this.endGame = true;
        debug("MUDAK!!!");
        this.xPlayer.lose = true;
		this.xPlayer.score = 0;
        return false;
		
	}
	
    if(check == null){
       this.endGame = true;
       debug("DRAW!!!");
	   cats += 1;
       this.tableBody.style.backgroundColor = "#00ff00";
	   
	   //this.xPlayer.score+=2;
	   
	   this.xPlayer.lose = true;
       return false;
    }

    var marker = 1;
    var winnerColor = "#0000ff";
	
    if(this.currentPlayer.marker == "O"){
        marker = -1;
        winnerColor = "#ff0000";
    }

    this.field[check] = marker;
    this.turns[check] = 0;



    var idRow = "table_" + this.id + "_" + getCellPosition(check + 1);
    debug(idRow);
    var tr = document.getElementById(idRow);
    tr.innerHTML = this.currentPlayer.marker;

    if(this.checkBoard()){
		
        this.tableBody.style.backgroundColor = winnerColor;
        //console.log("Winner = " + this.currentPlayer.marker);
		if(marker == 1){
			
			//this.xPlayer.score+=3;
			
			neuroEvolutionWins += 1;
			this.endGame = true;
			//this.xPlayer.lose = true;
			this.updateGraph();
			this.reset();
		}else{
			
			this.endGame = true;
			this.xPlayer.lose = true;
			//this.xPlayer.score = 0;
			//this.xPlayer = null;
			aiWins += 1;
		}
		//this.reset();
		//this.updateGraph();
		this.field = [0,0,0,0,0,0,0,0,0];
		this.turns = [1,1,1,1,1,1,1,1,1];
		
        return false;
    }
	this.round++;
    this.nextPlayer();
    return true;
}

nextPlayer(){
    if(this.currentPlayer.marker == "X"){
        this.currentPlayer = this.oPlayer;
    }else{
        this.currentPlayer = this.xPlayer;
    }
}

checkBoard(){
var winner = false;
var winnerMarker = -1;

var col0 = this.field[0] + this.field[1] + this.field[2];
var col1 = this.field[3] + this.field[4] + this.field[5];
var col2 = this.field[6] + this.field[7] + this.field[8];

var row0 = this.field[0] + this.field[3] + this.field[6];
var row1 = this.field[1] + this.field[4] + this.field[7];
var row2 = this.field[2] + this.field[5] + this.field[8];

var ang1 = this.field[0] + this.field[4] + this.field[8];
var ang2 = this.field[2] + this.field[4] + this.field[6];

if(col0 == -3 || col1 == -3 || col2 == -3 || row0 == -3 || row1 == -3 || row2 == -3 || ang1 == -3 || ang2 == -3) return true;
if(col0 == 3 || col1 == 3 || col2 == 3 || row0 == 3 || row1 == 3 || row2 == 3 || ang1 == 3 || ang2 == 3) return true;

return false;

}

updateGraph(){
	for(var i =0; i < 3; i++){
		
        for(var j=0; j < 3; j++){
			var idRow = "table_" + this.id + "_" + i + "_" + j;
            var col = document.getElementById(idRow);
            col.innerHTML = "";
        }

    }
	
}

createGraph(id){

    var arenaRow = document.getElementById("round1_" + (roundArena));
    if(arenaRow == null) arenaRow = arena;
    var table = document.createElement("table");
    table.id = "tableBody_" + id;
    this.tableBody = table;
    table.style.width = 90;
    table.style.height = 90;
    table.border = 1;

    for(var i =0; i < 3; i++){
        var row = document.createElement("tr");
        table.appendChild(row);
        for(var j=0; j < 3; j++){
            var col = document.createElement("td");
            col.id = "table_" + id + "_" + i + "_" + j;

            row.appendChild(col);

        }

    }

    arenaRow.appendChild(table);

}

}