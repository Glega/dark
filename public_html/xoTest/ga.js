function resetGame() {
    //arena.innerHTML = "<table style='width:800px'><tbody><tr><td id='round1_8'>&nbsp;</td>                                   <td id='round1_7'>&nbsp;</td>                                   <td id='round1_6'>&nbsp;</td>                                   <td id='round1_5'>&nbsp;</td>                                   <td id='round1_4'>&nbsp;</td>                                   <td id='round1_3'>&nbsp;</td>                                   <td id='round1_2'>&nbsp;</td>                                   <td id='round1_1'>&nbsp;</td>                                   <td id='round1_0'>&nbsp;</td>                               </tr>                               </tbody>                           </table>";    totalPopulation = maxPopulation;
    //roundArena = Math.floor(Math.log(maxPopulation)/Math.log(2));
    //maxRounds = roundArena;
    //tables = [];
	//genPlayers = [];
	for(var i = 0; i < tables.length; i++){
		var table = tables[i];
		table.reset();
		
	}
	 cats = 0; aiWins = 0; neuroEvolutionWins = 0;
}

// Create the next generation
function nextGeneration() {
 
  resetGame();
  generationVol++;
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
	tables[i].addBrain(player);
  }
  return newPlayers;
}

// Normalize the fitness of all birds
function normalizeFitness(players) {
  // Make score exponentially better?
  for (let i = 0; i < players.length; i++) {
    players[i].score = pow(players[i].score, 2);
   }

  // Add up all the scores
  let sum = 0;
  for (let i = 0; i < players.length; i++) {
    sum += players[i].score;
  }
  // Divide by the sum
  for (let i = 0; i < players.length; i++) {
    players[i].fitness = players[i].score / sum;
  }
}


// An algorithm for picking one bird from an array
// based on fitness
function poolSelection(players) {
  // Start at 0
  let index = 0;

  // Pick a random number between 0 and 1
  let r = random(1);

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