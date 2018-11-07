"use strict";


function resetGame() {   
	//targetObject.x = 0;//Math.random() * 150;	
    //targetObject.y = Math.random() * 400;
}

// Create the next generation
function nextGeneration() {
 
  resetGame();
  generationOtherVol++;
  // Normalize the fitness values 0-1
  normalizeFitness(allPlayers);
  // Generate a new set of birds
  activePlayers = generate(allPlayers);
  // Copy those birds to another array
  allPlayers = activePlayers.slice();
  
}

// Generate a new population of birds
function generate(oldPlayers) {
  let newPlayers = [];
  for (let i = 0; i < oldPlayers.length; i++) {
    // Select a bird based on fitness
    let player = poolSelection(oldPlayers);
    newPlayers[i] = player;
	//console.log(player.score);
	//player.score = 0;
	//tables[i].addBrain(player);
  }
  return newPlayers;
}

// Normalize the fitness of all birds
function normalizeFitness(players) {
  // Make score exponentially better?
  for (let i = 0; i < players.length; i++) {
    players[i].score = Math.pow(players[i].score, 2);
   }

  // Add up all the scores
  let sum = 0;
  for (let i = 0; i < players.length; i++) {
    sum += players[i].score;
  }
  // Divide by the sum
  for (let i = 0; i < players.length; i++) {
    players[i].fitness = players[i].score / sum;
	//console.log(players);
  }
}


// An algorithm for picking one bird from an array
// based on fitness
function poolSelection(players) {
  // Start at 0
  let index = 0;

  // Pick a random number between 0 and 1
  let r = Math.random(1);

  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= players[index].fitness;
    // And move on to the next
    index += 1;
  }

  // Go back one
  index -= 1;

  // Make sure it's a copy!
  // (this includes mutation)
  return players[index].copy();
}

