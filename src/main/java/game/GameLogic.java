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

    private HashMap<String, Integer> score;
    private List<UserProfile> playersArray;
    private UserProfile currentPlayer;
    private int index;
    private int round;
    private int currentScore;
    private final Room room;
    private final Random random;

    public GameLogic(Room room){

        this.room = room;
        this.random = new Random();
    }

    public void startGame(List<UserProfile> playersArray){                  //Start the game!
        round = 0; index = 0; currentScore = 0;
        score = new HashMap<>();

        this.playersArray = playersArray;
        currentPlayer = playersArray.get(0);
        index++;

        for(UserProfile user : playersArray){
            score.put(user.getLogin(), 0);
        }

        room.sendMessage(gameInfoToJson());

    }

    public void turn(){                                                     //change player

        score.put(currentPlayer.getLogin(), score.get(currentPlayer.getLogin()) + currentScore);

        if(round == 5){
            //End game
        }
        currentPlayer = playersArray.get(index);
        index++;
        if(index == playersArray.size()) index = 0;
        Debugger.debug("Current player = " + currentPlayer.getLogin() + "; index = " + index);
        room.sendMessage(gameInfoToJson());
        round++;
        currentScore = 0;
    }

    public String gameInfoToJson(){                                         //get game state(json format)
        JSONObject responseObject = new JSONObject();
        responseObject.put("currentPlayer", currentPlayer.getLogin());
        responseObject.put("gameInfo", getScore());
        responseObject.put("method", "updateGameInfoHandler");
        responseObject.put("round", round);
        responseObject.put("cscore", currentScore);
        return responseObject.toJSONString();
    }

    public void parseMessage(JSONObject object){
        String event = (String)object.get("event");

        String user = (String)object.get("user");                           //If not current user, then
        if(!user.equals(currentPlayer.getLogin())){
            Debugger.debug("Target = " + user + " Current = " + currentPlayer.getLogin());                        //return
            return;
        }

        switch (event){

            case "throwZarik":
                throwZarik();
                turn();
                break;
            case "endTurn":
                //turn();
                break;


        }

    }

    private JSONObject getScore(){
        Packet<String, Integer> p = new Packet<>(score);
        //room.getGameMessagePackets().sendMessage(room.getRoomId(), p);
        return p.toJSONObject();
    }

    private void throwZarik(){
        currentScore = random.nextInt(6) + 1;
        room.sendMessage(gameInfoToJson());
    }

}
