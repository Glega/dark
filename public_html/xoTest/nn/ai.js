(function(){
	
	var type = "random";
	var fitness = 2;

	
    function Ai(type){
		
    } 

    Ai.prototype = {
				
		init: function(f){
			fitness = Math.random();
		},
		
		think: function(table, turns){
		  //if(Math.random() < 0.5){
		  var hor1 = table[0] + table[1] + table[2];
		  var hor2 = table[3] + table[4] + table[5];
		  var hor3 = table[6] + table[7] + table[8];
		  
		  var ver1 = table[0] + table[3] + table[6];
		  var ver2 = table[1] + table[4] + table[7];
		  var ver3 = table[2] + table[5] + table[8];
		  
		  var dig1 = table[0] + table[4] + table[8];
		  var dig2 = table[2] + table[4] + table[6];
		  //console.log(hor1, hor2, hor3, ver1, ver2, ver3, dig1,dig2);
		  if(hor1 == -2) return this.getBrainTurn([0,1,2], turns);
		  if(hor2 == -2) return this.getBrainTurn([3,4,5], turns);
		  if(hor3 == -2) return this.getBrainTurn([6,7,8], turns);
		  
		  if(ver1 == -2) return this.getBrainTurn([0,3,6], turns);
		  if(ver2 == -2) return this.getBrainTurn([1,4,7], turns);
		  if(ver3 == -2) return this.getBrainTurn([2,5,8], turns);
		  
		  if(dig1 == -2) return this.getBrainTurn([0,4,8], turns);
		  if(dig2 == -2) return this.getBrainTurn([2,4,6], turns);
		  
		  
		  if(hor1 == 2) return this.getBrainTurn([0,1,2], turns);
		  if(hor2 == 2) return this.getBrainTurn([3,4,5], turns);
		  if(hor3 == 2) return this.getBrainTurn([6,7,8], turns);
		  
		  if(ver1 == 2) return this.getBrainTurn([0,3,6], turns);
		  if(ver2 == 2) return this.getBrainTurn([1,4,7], turns);
		  if(ver3 == 2) return this.getBrainTurn([2,5,8], turns);
		  
		  if(dig1 == 2) return this.getBrainTurn([0,4,8], turns);
		  if(dig2 == 2) return this.getBrainTurn([2,4,6], turns);
		  //}
		  //console.log("make random turn");
		  
		  var sr = this.getRandomTurn(turns);
		  //console.log("random = " + sr);
		  if(turns[sr] == 1) return sr;
		  
		  for(var i = 0; i < turns.length; i++){
			if(turns[i] == 1){
				
				return i;
			}

		  }		
		  return null;
		},
		
		getRandomTurn: function(turns){
			
			if(turns.length == 0) return 0;
			
			var usefullTurns = [];
			for(var i = 0; i < turns.length; i++){
				if(turns[i] == 1) usefullTurns.push(i);
			}
			
			var s = this.getRandomInt(0, usefullTurns.length - 1);
			
			//console.log("S = " + s + "; turns = " + usefullTurns + "; US = " + usefullTurns[s]);
			
			return usefullTurns[s];
			
			
		},
		
		getBrainTurn: function(indexs, turns){
			//console.log(indexs, turns);
			for(var key = 0; key < indexs.length; key++){
				var index = indexs[key];
				if(turns[index] == 1) return index;
			}
		},
		
		getRandomInt: function(min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		},
	    
        update: function(dt){
			
        },
		
		toString: function(){
			return "AI";
		}, 
			
		getInfo: function(){
			
		}
    }
   
   window.Ai = Ai;
})();