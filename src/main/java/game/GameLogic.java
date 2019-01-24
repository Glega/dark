package game;

import accounts.UserProfile;
import org.json.simple.JSONObject;
import packets.gamePackets.Packet;
import util.Debugger;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by Worker2 on 21.05.2018.
 */
public class GameLogic {
    private HashMap<String, UserProfile> playersArray;
    private HashMap<String, String> playersPick;
    private final Room room;
    private final Random random;
    private String frame;


    private int round;

    public GameLogic(Room room){
        this.room = room;
        this.random = new Random();
        this.frame = PREPARE;
    }

    public void startGame(HashMap<String, UserProfile> playersArray){                //Start the game!
        this.playersArray = playersArray;
        this.playersPick = new HashMap<>();
        //room.sendMessage(gameInfoToJson());
        round = 1;
        this.frame = START;
        room.sendMessage(gameInfoToJson());
    }

    public void restart(){
        this.playersPick = new HashMap<>();
        this.frame = START;
        room.sendMessage(gameInfoToJson());
    }

    public void turn(){                                                     //change player

    }

    public String gameInfoToJson(){                                         //get game state(json format)
        JSONObject responseObject = new JSONObject();
        responseObject.put("method", "onGameEventHandler");
        responseObject.put("round", this.round);
        responseObject.put("frame", this.frame);
        responseObject.put("players", this.playersArray.size());
        return responseObject.toJSONString();
    }

    public JSONObject toJSON(){
        JSONObject responseObject = new JSONObject();
        responseObject.put("method", "onGameEventHandler");
        responseObject.put("round", this.round);
        responseObject.put("frame", this.frame);
        responseObject.put("players", this.playersArray.size());
        return responseObject;
    }

    public void parseMessage(JSONObject object){
        String event = (String)object.get("event");
        String user = (String)object.get("user");                           //If not current user, then

        switch (event){

            case "getGameInfo":
                room.sendMessage(gameInfoToJson());
                break;

            case "endTurn":
                //turn();
                break;
            case "pick": //Юзер сделал свой выбор
                Debugger.debug(user + ": pick " + (String)object.get("pick"));
                String pick = (String)object.get("pick");
                if(playersPick.get(user) != null) return;
                playersPick.put(user, pick);

                JSONObject response = toJSON();
                response.put("playerTurn", user);
                room.sendMessage(response.toJSONString());

                if(playersArray.size() == playersPick.size()){            //Если все сделали выбор, то проверяем кто победил
                    Debugger.debug("End game " + playersPick.values().toArray()[0]);
                    checkGame();
                }
                break;
            case "fire":
                checkRullete(user);
                break;
        }

    }

    private void checkGame(){
        if(this.frame.equals(END_GAME)) return;

        this.frame = GAME;
        String firstPlayer = (String) playersPick.keySet().toArray()[0];
        String secPlayer = (String) playersPick.keySet().toArray()[1];

        String first = playersPick.get(firstPlayer);
        String sec = playersPick.get(secPlayer);

        String winner = firstPlayer;

        Debugger.debug("Pick = " + first + sec);

        String compareString = first + sec;

        if(compareString.equals("ScissorsStone") || compareString.equals("StonePaper") || compareString.equals("PaperScissors")){
            winner = secPlayer;
        }

        if(first.equals(sec)) winner = "draw";


        String loser = firstPlayer;

        if(loser.equals(winner)) loser = secPlayer;
        Debugger.debug("Win " + winner + "; loser = " + loser);

        JSONObject response = toJSON();
        response.put("firstPlayer", firstPlayer);
        response.put("secPlayer", secPlayer);
        response.put("firstPick", first);
        response.put("secPick", sec);
        response.put("winner", winner);
        response.put("loser", loser);
        response.put("event", "endTurn");
        room.sendMessage(response.toJSONString());

        this.frame = FIRE;

        //checkRullete(loser);
    }

    private void checkRullete(String user){
        //TODO
        //Check fire player
        if(!this.frame.equals(FIRE)) return;

        boolean fire = false;

        int r = random.nextInt(6) + 1;

        if(r > 6 - round) fire = true;

        JSONObject response = toJSON();

        response.put("event", "fire");
        response.put("user", user);
        response.put("status", fire);
        room.sendMessage(response.toJSONString());
        round++;

        if(fire){
            this.frame = END_GAME;
            return;
        }

        restart();


    }




    private static String PREPARE = "prepare";
    private static String START = "start";
    private static String GAME = "game";
    private static String FIRE = "fire";
    private static String END_GAME = "endGame";
    private static String WAITING = "wait";
    private static String PAPER = "paper";
    private static String SCISSORS = "scissors";
    private static String STONE = "stone";
}
