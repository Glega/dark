package accounts;

import game.Room;
import sockets.GameSocket;

/**
 * Created by Worker2 on 18.10.2017.
 */
public class UserProfile {

    private final String login;
    private final String password;
    private String nickName;

    private int wins; //Сколько побед
    private int defeats;    //и поражений

    private GameSocket socket;
    private final int userId;

    private Room room;
    private int roomPosition;//Позиция в массиве игроков комнаты, чтобы его потом удалить из списка игроков
    private String inGameStatus;



    public  UserProfile(String login, String password){
        this.login = login;
        this.password = password;
        this.wins = 0;
        this.defeats = 0;
        this.userId = IDS;
        this.inGameStatus = NOT_READY;
        this.roomPosition = 0;
        IDS++;
    }


    public String getNickName(){return nickName;}

    public void setNickName(String nickName){
        this.nickName = nickName;
    }

    public String getLogin(){
        return login;
    }

    public String getPassword(){
        return password;
    }

    public void setSocket(GameSocket socket){this.socket = socket;}

    public GameSocket getSocket(){return this.socket;}

    public int getUserId(){return userId;}

    public void setRoom(Room room){this.room = room;}

    public Room getRoom(){return this.room;}

    public void setRoomPosition(int roomPosition){this.roomPosition = roomPosition;}

    public int getRoomPosition(){return this.roomPosition;}

    public void setInGameStatus(String inGameStatus){this.inGameStatus = inGameStatus;}

    public String getInGameStatus(){return this.inGameStatus;}

    public void exitRoom(){
        if(room != null){
            room.removeUser(this);
        }
        room = null;
        setInGameStatus(UserProfile.NOT_READY);
    }

    public void joinGame(){
        if(room == null || inGameStatus == IN_GAME) return;
        room.addPlayer(this);
    }

    static public int IDS = 0;

    static public String NOT_READY = "notReady";
    static public String PLAYER_READY = "ready";
    static public String IN_GAME = "inGame";
}
