package game;

import accounts.UserProfile;
import org.json.simple.JSONObject;
import packets.gamePackets.GameMessagePackets;
import packets.gamePackets.Packet;
import packets.gamePackets.RemoveUserHandler;
import sockets.GameSocket;
import util.Debugger;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by Worker2 on 25.04.2018.
 */
public class Room {

    private String roomId;
    private int roomCounter;

    private String roomStatus = "NOT_GAME";

    private transient HashMap<String, UserProfile> users;
    private transient HashMap<String, UserProfile> players;
    private transient GameLogic gameLogic;

    private int usersCount = 0;
    private int playersCount = 0;

    private int maxPlayers = 2;

    private transient RemoveUserHandler removeUserHandler;
    private transient GameMessagePackets gameMessagePackets;

    private static int ROOMS = 1;


    public Room(){
        users = new HashMap<>();
        this.gameLogic = new GameLogic(this);
        players = new HashMap<>();
        roomCounter = ROOMS;
        ROOMS++;
    }

    public void addUser(UserProfile userProfile){
        if(users.get(userProfile.getLogin()) != null ) return;
        users.put(userProfile.getLogin(), userProfile);
        userProfile.setRoom(this);
        usersCount++;
    }

    public void addPlayer(UserProfile userProfile){
        if(roomStatus == "GAME"){
            onJoinGameHandler(userProfile, "false");
            return;
        }

        if(userProfile.getInGameStatus() == UserProfile.PLAYER_READY || userProfile.getInGameStatus() == UserProfile.IN_GAME){
            onJoinGameHandler(userProfile, "false");
            return;
        }

        players.put(userProfile.getLogin(), userProfile);
        userProfile.setInGameStatus(UserProfile.PLAYER_READY);

        Debugger.debug(userProfile.getInGameStatus());

        if(players.size() == maxPlayers) {
            Debugger.debug("Game start in room#" + roomId);
            roomStatus = "GAME";
            //userProfile.setInGameStatus(UserProfile.IN_GAME);
            gameLogic.startGame(players);
            JSONObject response = new JSONObject();
            response.put("gameStart", "gameStart");
            //Packet<String, String> p = new Packet<>(createPacket("onGameStartHandler", userProfile.getLogin(), new String[]{"k", "kl"}));
            sendMessage(createJSONPacket("onGameStartHandler", userProfile.getLogin(), response.toJSONString()));
        }
        playersCount++;
        userProfile.setRoomPosition(playersCount);
        onJoinGameHandler(userProfile, "true");
    }

    private void onJoinGameHandler(UserProfile userProfile, String status){
        HashMap<String, String> p = new HashMap<>();
        p.put("method", "onUserJoinGame");
        p.put("user", userProfile.getLogin());
        p.put("status", status);
        Packet packet = new Packet(p);
        sendMessage(packet.toJSON());
    }

    public void removeUser(UserProfile userProfile){
        String login = userProfile.getLogin();
        int roomPosition = userProfile.getRoomPosition();
        users.remove(login);
        HashMap<String, String> p = new HashMap<>();
        p.put("method", "userExitRoom");
        p.put("user", login);
        Packet packet = new Packet(p);
        sendMessage(packet.toJSON());
        usersCount--;
        if(users.size() == 0) RoomService.getRoomService().removeRoom(this);
        Debugger.debug("user " + login + " left room" + "; usersCount = " + String.valueOf(users.size()));

        if(players.get(login) != null){
            players.remove(login);
            playersCount--;
        }

    }

    public void onDisconectUser(UserProfile userProfile){
        //TODO: Remove user from room or make decision in gamelogic

        if(userProfile.getInGameStatus() == UserProfile.IN_GAME || userProfile.getInGameStatus() == UserProfile.PLAYER_READY){
            //gameLogic.turn();
            //do something for user
            return;
        }
        //or remove user from room and set status not ready
        userProfile.exitRoom();
    }


    public HashMap<String, UserProfile> getUsers(){
        return users;
    }

    public Set<String> getUsersToString(){
        Set<String> logins = Collections.newSetFromMap(new ConcurrentHashMap<>());
        for(Map.Entry<String, UserProfile> entry : users.entrySet()){
            logins.add(entry.getKey());
        }
        return logins;
    }

    public Set<String> getPlayersToString(){
        Set<String> logins = Collections.newSetFromMap(new ConcurrentHashMap<>());
        for(Map.Entry<String, UserProfile> entry : players.entrySet()){
            logins.add(entry.getKey());
        }
        return logins;
    }

    public HashMap<String, String> createPacket(String method, String login, String[] args){
        HashMap<String, String> obj = new HashMap<>();
        obj.put("method", method);
        obj.put("login", login);
        for(String params : args){
            obj.put(params, params);
        }
        return obj;
    }

    public String createJSONPacket(String method, String login, String data){
        JSONObject response = new JSONObject();
        response.put("method", method);
        response.put("login", login);
        response.put("data", data);
        return response.toJSONString();
    }

    public void sendMessage(String JSONMsg){

        for(Map.Entry<String, UserProfile> entry : users.entrySet()){
            try {
                GameSocket socket = entry.getValue().getSocket();
                if(socket != null) socket.sendString(JSONMsg);
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }

        //old
        //gameMessagePackets.sendMessage(this.roomId, JSONMsg);

    }


    public String toJson(){                                         //get game state(json format)
        //Сделать возврат комнаты в джсоне
        //Но надо как-то чтоб все столы в джсон, при добавлении комнаты помещать в строку, при
        //удалении стола, как-то убирать из строки информацию
        return "fuck";
    }



    public void setRoomId(String roomId){this.roomId = roomId;}

    public int getMaxPlayers(){return this.maxPlayers;}

    public void setRemoveUserHandler(RemoveUserHandler removeUserHandler){this.removeUserHandler = removeUserHandler;}

    public void setGameMessagePackets(GameMessagePackets gameMessagePackets){this.gameMessagePackets = gameMessagePackets;}

    public GameMessagePackets getGameMessagePackets(){return this.gameMessagePackets;}

    public String getRoomId(){return this.roomId;}

    public GameLogic getGameLogic(){return this.gameLogic;}

    public String getRoomStatus(){return this.roomStatus;}

}
