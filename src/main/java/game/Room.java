package game;

import accounts.UserProfile;
import org.json.simple.JSONObject;
import packets.gamePackets.GameMessagePackets;
import packets.gamePackets.Packet;
import packets.gamePackets.RemoveUserHandler;
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
    private transient List<UserProfile> players;
    private transient GameLogic gameLogic;

    private int maxPlayers = 3;

    private transient RemoveUserHandler removeUserHandler;
    private transient GameMessagePackets gameMessagePackets;

    private static int ROOMS = 1;


    public Room(){
        users = new HashMap<>();
        this.gameLogic = new GameLogic(this);
        players = new ArrayList<>();
        roomCounter = ROOMS;
        ROOMS++;
    }

    public void addUser(UserProfile userProfile){
        if(users.get(userProfile.getLogin()) != null ) return;
        users.put(userProfile.getLogin(), userProfile);
        userProfile.setRoom(this);
    }

    public void addPlayer(UserProfile userProfile){
        if(roomStatus == "GAME") return;
        players.add(userProfile);
        userProfile.setInGameStatus(UserProfile.IN_GAME);
        if(players.size() == maxPlayers) {
            roomStatus = "GAME";
            gameLogic.startGame(players);
            Packet<String, String> p = new Packet<>(createPacket("onGameStartHandler", userProfile.getLogin(), new String[]{"k", "kl"}));
            sendMessage(p.toJSON());
        }
    }

    public void removeUser(String login){
        users.remove(login);
        HashMap<String, String> p = new HashMap<>();
        p.put("method", "userExitRoom");
        p.put("user", login);
        Packet packet = new Packet(p);
        sendMessage(packet.toJSON());
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

    public HashMap<String, String> createPacket(String method, String login, String[] args){
        HashMap<String, String> obj = new HashMap<>();
        obj.put("method", method);
        obj.put("login", login);
        for(String params : args){
            obj.put(params, params);
        }
        return obj;
    }

    public void sendMessage(String JSONMsg){
        gameMessagePackets.sendMessage(this.roomId, JSONMsg);
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

}
