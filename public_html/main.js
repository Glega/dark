
var roomFrame = null;
var startFrame = null;

var params = {};


function getRooms(){
var data = {method:"getRooms", user: userId};
sendMessage(data, showRoomList);
}

function showRoomList(event){
    var rsp = JSON.parse(event.data);
    var tableDiv = document.getElementById("tableList");
    tableDiv.innerHTML = "";
    var table = document.createElement("table");
    table.id = "roomList";
    var headRow = document.createElement("tr");
    table.appendChild(headRow);

    /*
    var headers = ["№ Комнаты", "Игроки", "Статус"]

    for(var i = 0; i < headers.length; i++){
        var headCol = document.createElement("td");
        headCol.innerHTML = headers[i];
        headRow.appendChild(headCol);
    }
    */

    var s = 0;
    for(var key in rsp){
            if(rsp.hasOwnProperty(key)){

              var row = document.createElement("tr");

              table.appendChild(row);
              var data = rsp[key];

              var col = document.createElement("td");
              col.innerHTML = data['roomCounter'];
              col.style.width = "100px";
              row.appendChild(col);

              col = document.createElement("td");
              col.innerHTML = data['maxPlayers'];
              col.style.width = "150px";
              row.appendChild(col);

              col = document.createElement("td");
              col.innerHTML = data['roomStatus'];
              col.style.width = "50px";
              row.appendChild(col);

              /*
              for(var i in data){
                var col = document.createElement("td");
                console.log("FUUUU" + i);
                col.innerHTML = data[i];
                row.appendChild(col);
              }
              */
              if(s == 1){ row.style.backgroundColor = "#F5F5F5";s = 0}else{s++;}

              var link = document.createElement("a");
              link.href = "javascript:connectRoom('" + data["roomId"] + "');";
              link.innerHTML = "Connect...";
              var tdLink = document.createElement("td");
              tdLink.appendChild(link);
              row.appendChild(tdLink);

            }
    }
    tableDiv.appendChild(table);

}

function connectRoom(roomID){

console.log("Try to connect " + roomID);
ws.onclose = function(e){
    document.location.href = "./room/" + roomID;
    //console.log("Disconect!" + roomID);
}
ws.close();
}



function createRoom(){
var rName = document.getElementById("roomName");
var data = {method:"createRoom", user: userId, roomName: "fff"};
sendMessage(data, onRoomCreateHandler);
getRooms();
}

function onRoomCreateHandler(event){
 console.log(event.data);
 var roomDiv = document.getElementById("room");
 roomDiv.style.display = "block";
 var data = JSON.parse(event.data);
 connectRoom(data.id);
}

function exitRoom(){
    var data = {method:"exitRoom", user: user};
    sendMessage(data, exitRoomHandler);


}

function exitRoomHandler(event){
 roomFrame.style.display = "none";
 startFrame.style.display = "block";
}

function init(obj) {

    params.showNewFunction = showNewFunction;
    console.log("Room id = " + roomId);
    roomFrame = document.getElementById("showRoomOptions");
    startFrame = document.getElementById("startOptions");


    if(roomId != 'none'){
      obj = null;
      roomFrame.style.display = "block";
      startFrame.style.display = "none";
    }


    var server = window.location.href.substr(7, document.location.href.length).split("/")[0];
    ws = new WebSocket("ws://" + server + "/api");
    ws.onopen = function (event) {
     if(obj != null) obj.call(this);
    }
    ws.onmessage = function (event) {

    }
    ws.onclose = function (event) {
    }


}

function sendChatMessage(){
    var messageField = document.getElementById("message");
    //var userNameField = document.getElementById("username");
    var message = messageField.value;
    var obj = {method:"chatMessage", data: message};
    ws.send(JSON.stringify(obj));
    ws.onmessage = function (event){console.log(event.data)};
    //messageField.value = '';

}

function sendMessage(obj, callBack) {
    obj.sid = sid;
    ws.send(JSON.stringify(obj));
    ws.onmessage = callBack;
}

function showNewFunction(data){
console.log(data);
}

function showEvent(data){

if(params[data.key]){

 params[data.key].call(this, data);

}else{console.log("Bad command");}

}