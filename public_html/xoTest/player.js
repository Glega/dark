function mutate(x) {
  if (Math.random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

var playerID = 0;

class Player {
  constructor(brain) {
    // Is this a copy of another Bird or a new one?
    // The Neural Network is the bird's "brain"
    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    } else {
	  var hn = getRandomInt(3, 81);
      this.brain = new NeuralNetwork(11, hn, 9);
    }

    // Score is how many frames it's been alive
    this.score = 0;
    // Fitness is normalized version of score
    this.fitness = 0;
    this.table = null;
    this.marker = "X";
    this.id = playerID;
	this.lose = false;
	this.memory = 0;
	this.imFirst = 0;
    playerID++;
  }

  // Create a copy of this bird
  copy() {
    return new Player(this.brain);
  }

  think(table, turns, round){
        //console.log(table);
		
		if(round == 0) this.imFirst = 1;
		
		var m = 1;
		
		if(this.marker == "X") m = -1;
		
		var inputs = [];
		var indexs = [];
		
		var s = 0;
		for(var i = 0; i < table.length; i++){
			s = 0;
			if(table[i] > 0) s = 0.05;
			if(table[i] < 0) s = 0.04;
			
			if(table[i] == 0) s = 0.99;
			//indexs.push(i * 0.99 + 0.01);
			inputs.push(s);
        }
		inputs.push(Math.random() * 0.99 + 0.01);
		//if(round == 0) inputs.push(Math.random() * 0.99 + 0.01);
		//else inputs.push(0.01);
		inputs.push((round / 10) * 0.99 + 0.01);
		
		//console.log(inputs);
        var action = this.brain.predict(inputs);
        //*
		var maxI = 0;
        var maxValue = 0;
		//console.log(action);
		//var rTurns = [];

        for(var i = 0; i < 9; i++){
            //action[i] *= turns[i];
            if(action[i] > maxValue){
                maxI = i;
                maxValue = action[i];
            }
			
			//if(action[i] > 0) rTurns.push(i);
        }
		
        if(maxValue == 0) return null;
		//var tId = getRandomInt(0, rTurns.length - 1);
		//console.log(this.brain.id);
		 //maxI = rTurns[tId];
		
		
		if(turns[maxI] == 0){
			//this.brain.mutate(mutate);
			return -1;
			
		}
		
		  var hor1 = table[0] + table[1] + table[2];
		  var hor2 = table[3] + table[4] + table[5];
		  var hor3 = table[6] + table[7] + table[8];
		  
		  var ver1 = table[0] + table[3] + table[6];
		  var ver2 = table[1] + table[4] + table[7];
		  var ver3 = table[2] + table[5] + table[8];
		  
		  var dig1 = table[0] + table[4] + table[8];
		  var dig2 = table[2] + table[4] + table[6];
		  
		  
		  
		  //console.log("AI hor1 = " + hor1);
		  if(hor1 == 2 && (maxI == 0 || maxI == 1 || maxI == 2)) this.score += 10;
		  if(hor2 == 2 && (maxI == 3 || maxI == 4 || maxI == 5)) this.score += 10;
		  if(hor3 == 2 && (maxI == 6 || maxI == 7 || maxI == 8)) this.score += 10;
		  
		  if(ver1 == 2 && (maxI == 0 || maxI == 3 || maxI == 6)) this.score += 10;
		  if(ver2 == 2 && (maxI == 1 || maxI == 4 || maxI == 7)) this.score += 10;
		  if(ver3 == 2 && (maxI == 2 || maxI == 5 || maxI == 8)) this.score += 10;
		  
		  if(dig1 == 2 && (maxI == 0 || maxI == 4 || maxI == 8)) this.score += 10;
		  if(dig2 == 2 && (maxI == 2 || maxI == 4 || maxI == 6)) this.score += 10;
		  
		  
		  if(hor1 == -2 && (maxI == 0 || maxI == 1 || maxI == 2)) this.score += 50;
		  if(hor2 == -2 && (maxI == 3 || maxI == 4 || maxI == 5)) this.score += 50;
		  if(hor3 == -2 && (maxI == 6 || maxI == 7 || maxI == 8)) this.score += 50;
		  
		  if(ver1 == -2 && (maxI == 0 || maxI == 3 || maxI == 6)) this.score += 50;
		  if(ver2 == -2 && (maxI == 1 || maxI == 4 || maxI == 7)) this.score += 50;
		  if(ver3 == -2 && (maxI == 2 || maxI == 5 || maxI == 8)) this.score += 50;
		  
		  if(dig1 == -2 && (maxI == 0 || maxI == 4 || maxI == 8)) this.score += 50;
		  if(dig2 == -2 && (maxI == 2 || maxI == 4 || maxI == 6)) this.score += 50;
		
		
		this.score++;
		return maxI;
		//*/
		
		//*
		
		
		//if(turns[s] == 0){
			//this.brain.mutate(mutate);
		//	return -1;
			
		//}
		
		//return s;
		//*/
  }

}