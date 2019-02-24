package game;

import accounts.AccountServise;
import accounts.UserProfile;
import com.google.gson.Gson;
import com.google.gson.internal.Streams;
import org.eclipse.jetty.websocket.api.Session;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import packets.IDisconnectPacket;
import packets.gamePackets.GameMessagePackets;
import packets.gamePackets.Packet;
import packets.gamePackets.RemoveUserHandler;
import sockets.GameSocket;
import util.Debugger;
import util.MD5Util;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by Worker2 on 24.10.2017.
 */
public class MessageService {
    private Set<GameSocket> webSockets;
    private HashMap<String, GameSocket> sockets;

    private IDisconnectPacket disconnectPacket;
    private RemoveUserHandler removeUserHandler;
    private String roomId;

    private final GameMessagePackets messageSender;
    private final AccountServise accountServise;
    private final RoomService roomService;


    public MessageService(AccountServise accountServise) {
        this.sockets = new HashMap<>();
        this.accountServise = accountServise;
        this.webSockets = Collections.newSetFromMap(new ConcurrentHashMap());
        this.roomService = RoomService.getRoomService();
        this.roomId = "";
        /*/
        removeUserHandler = (String login, String target) -> {
            Debugger.debug("Login = " + login + " target = " + target);
            removeUserFromRoom(login, target);
        };
        //*/
        messageSender = (String roomId, String JSONMsg) ->{
            sendMessageTo(roomId, JSONMsg);
        };
    }

    public void parseMessage(String msg, GameSocket socket) throws ParseException {
        JSONObject obj = getJSONObject(msg);
        String method = (String)obj.get("method");
        //Debugger.debug("Method = " + method);
        String sid = (String)obj.get("sid");

        UserProfile profile = accountServise.getUserBySessionId(sid);
        if(profile == null){
            return;
        }

        String login = profile.getLogin();

        JSONObject responseJSON = new JSONObject();
        Gson gson = new Gson();
        Room room = getRoomFromJSON(obj);

        switch (method){            //Do something switch method, like getRooms, chatMessage

            case "getRooms":        //Method return rooms
                String data = gson.toJson(roomService.getRooms());
                socket.sendString(data);
                break;


            case "createRoom":      //create room and send to user room id
                room = roomService.createRoom(login);
                room.setGameMessagePackets(messageSender);

                responseJSON.put("method", "onRoomCreateHandler");
                responseJSON.put("status", "done");
                responseJSON.put("roomId", room.getRoomId());

                socket.sendString(responseJSON.toJSONString());

                break;

            case "chatMessage":
                String chat_msg = (String)obj.get("message");
                responseJSON.put("method", "onChatMessageHandler");
                responseJSON.put("message", login + ": " + chat_msg);
                sendMessageTo(roomId, responseJSON.toJSONString());
                break;

            case "joinRoom":        //register user and socket in game
                if(room == null) {
                    responseJSON.put("method", "onJoinRoomHandler");
                    responseJSON.put("status", "error");
                    socket.sendString(responseJSON.toJSONString());
                    return;
                }
                room.addUser(profile);
                registerSocket(profile, socket);
                //profile.setInGameStatus(UserProfile.PLAYER_READY);
                responseJSON.put("method", "onJoinRoomHandler");
                responseJSON.put("players", room.getPlayersToString());
                responseJSON.put("spectators", room.getUsersToString());
                sendMessageTo(roomId, responseJSON.toJSONString());
                break;

            case "exitRoom":        //remove user from room
                profile.exitRoom();
                responseJSON.put("method", "exitRoomHandler");
                responseJSON.put("status", "done");
                socket.sendString(responseJSON.toJSONString());
                break;

            case "joinGame":        //set user status in game is READY
                profile.joinGame();
                responseJSON.put("method", "changeGameStatusHandler");
                responseJSON.put("status", profile.getInGameStatus());
                socket.sendString(responseJSON.toJSONString());
                break;
            case "playerEndTurn":
                //parseRoomMessage(room, obj);
                //room.endTurn();
                //responseJSON.put("method", "endTurnHandler");
                //responseJSON.put("gamePacket", room.getGameLogic().gameInfoToJson());
                //sendMessageTo(roomId, responseJSON.toJSONString());
                break;
            case "gameEvent":
                //Debugger.debug("Room = " + room + " MessageService:line 131");
                parseRoomMessage(room, obj);
                break;
        }

    }

    private void parseRoomMessage(Room room, JSONObject obj){
        if(room == null) return;
        room.getGameLogic().parseMessage(obj);
    }


    private Room getRoomFromJSON(JSONObject obj){
        roomId = (String)obj.get("roomId");
        if(roomId == null) return null;
        Room room = roomService.getRoom(roomId);
        return room;
    }


    private void registerSocket(UserProfile profile, GameSocket socket){
        profile.setSocket(socket);
        disconnectPacket = (GameSocket gameSocket)->{
            profile.setSocket(null);
            JSONObject responseJSON = new JSONObject();
            responseJSON.put("user", profile.getLogin());
            responseJSON.put("method", "onUserChangeState");
            responseJSON.put("reason", "disconnect");
            //sendMessageTo(profile.getRoom().getRoomId(), responseJSON.toJSONString());
            profile.getRoom().onDisconectUser(profile);
            Debugger.debug("User " + profile.getLogin() + " disconnected!");
            Debugger.debug(profile.getInGameStatus());
        };
        socket.setDisconnectHandler(disconnectPacket);
    }

    public JSONObject getJSONObject(String msg) throws ParseException {
        JSONParser parser = new JSONParser();
        JSONObject obj = (JSONObject)parser.parse(msg);
        return obj;
    }

    public void sendMessage(String data) {
        for (GameSocket user : webSockets) {
            try {
                user.sendString(data);
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }

    public void sendMessageTo(String roomId, String data){
        Room room = roomService.getRoom(roomId);
        if(room == null) return;
        room.sendMessage(data);

    }

    public void add(GameSocket webSocket, String uid) {
        System.out.println("Socket " + webSocket.toString() + " exist: " + webSockets.contains(webSocket));
        webSockets.add(webSocket);
        sockets.put(uid, webSocket);
    }

    public void remove(GameSocket webSocket, String uid) {
        Debugger.debug("try to remove " + webSocket);
        sockets.remove(uid);
        webSockets.remove(webSocket);
    }

    private void removeUserFromRoom(String login, String roomId){
        sendMessageTo(roomId, "Fuckin user" + login);
    }

}
