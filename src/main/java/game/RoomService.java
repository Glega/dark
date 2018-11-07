package game;

import accounts.UserProfile;
import util.MD5Util;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Worker2 on 27.03.2018.
 */
public class RoomService {
    private Map<String, Room> rooms;

    private static RoomService roomService;


    public RoomService(){
        rooms = new HashMap<>();
    }

    public Map<String, Room> getRooms(){return rooms;}

    public Room getRoom(String roomId){
        return rooms.get(roomId);
    }


    public Room createRoom(String roomName) {
        Room room = new Room();
        String roomId = MD5Util.MD5Hash(roomName + "Fuck you");
        room.setRoomId(roomId);
        rooms.put(roomId, room);
        return room;
    }

    public void removeRoom(Room room){
        rooms.remove(room.getRoomId());
    }

    public void registerUser(UserProfile user, String roomId){//Put user and socket to room
        Room room = rooms.get(roomId);
    }

    static public RoomService getRoomService(){
        if(roomService == null){
            roomService = new RoomService();
        }
        return roomService;
    }

}
