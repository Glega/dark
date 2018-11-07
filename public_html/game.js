var users = {};
var params = {};
var gameStart = false;


function initParams(){
    params.onChatMessageHandler = onChatMessageHandler;
    params.onUserChangeState = onUserChangeState;
    params.changeGameStatusHandler = changeGameStatusHandler;
    params.onJoinRoomHandler = onJoinRoomHandler;

    params.onGameStartHandler = onGameStartHandler;
    params.updateGameInfoHandler = updateGameInfoHandler;
}



function onSocketMessageHandler(event){
var data = JSON.parse(event.data);
console.log(data);
console.log("Use method: " + data.method);
if(params[data.method]){params[data.method].call(this, data);}
else{console.log("Bad command");}
}

function sendMessage(obj) {
    obj.sid = sid;
    obj.user = userId;
    ws.send(JSON.stringify(obj));
}

function chatMsgKeyHandler(e){
    if(e.keyCode === 13){
        e.preventDefault(); // Ensure it is only this code that rusn
        sendChatMessage();
    }
}




function joinRoom(){
    obj = {};
    obj.roomId = roomId;
    obj.method = "joinRoom";
    console.log("try to join room");
    sendMessage(obj);
}

function onJoinRoomHandler(data){
  var target = document.getElementById("joinFrame");
  target.style.display = "none";

  target = document.getElementById("joinGameButton");
  target.style.display = "block";

  var arr = data.spectators;
  for (var key in arr){
   console.log(arr[key]);
   var id = arr[key];
   users[id] = id;
  }
  showRoomUsers();
}

function joinGame(){
    obj = {};
    obj.roomId = roomId;
    obj.method = "joinGame";
    sendMessage(obj);
}

function changeGameStatusHandler(data){
  console.log(data.status);
  if(data.status == "ready") onGameStartHandler({});
}

function onGameStartHandler(data){
var divJoinGameButton = document.getElementById("joinGameButton");
divJoinGameButton.style.display = "none";

var gameFrame = document.getElementById("main");
gameFrame.style.display = "block";

console.log("Game started2 ");

}

function updateGameInfoHandler(data){
  //var message = data.currentPlayer + ": бросил зарики";

  var roundField = document.getElementById("round");
  roundField.innerHTML = data.round;

  var currentPlayerField = document.getElementById("currentPlayer");
  currentPlayerField.innerHTML = data.currentPlayer;

  var cscore = document.getElementById("cscore");
  cscore.innerHTML = data.cscore;

  //var messageField = document.getElementById("messages");
 // messageField.value += message + '\n';
 //console.log("Game updated@!");
}

function endTurn(){
    obj = {};
    obj.roomId = roomId;
    obj.method = "gameEvent";
    obj.event = "endTurn";
    sendMessage(obj);
}

function throwZarik(){
    obj = {};
    obj.roomId = roomId;
    obj.method = "gameEvent";
    obj.event = "throwZarik";
    sendMessage(obj);

}

function sendChatMessage(){
    var messageField = document.getElementById("message");
    var message = messageField.value;

    if(message.length == 0) return;
    messageField.value = "";

    var obj = {method:"chatMessage", message: message, roomId: roomId};
   sendMessage(obj);
}

function onChatMessageHandler(data){
  var messageField = document.getElementById("messages");
  messageField.value += data.message + '\n';
}

function onUserChangeState(data){
    if(data.reason == "connect") users[data.user] = data.user;
    if(data.reason == "disconnect"){
      var messageField = document.getElementById("messages");
      messageField.value += data.user + " съебался из комнаты." + '\n';
      delete users[data.user];
    }
    showRoomUsers();
}



function showRoomUsers(){
 var userField = document.getElementById("users");
    userField.value = "";

    for (var user in users) {
      userField.value += user + "\n";
    }
}


