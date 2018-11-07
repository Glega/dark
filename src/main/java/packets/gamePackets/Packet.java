package packets.gamePackets;

import accounts.UserProfile;
import org.json.simple.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Worker2 on 22.05.2018.
 */
public class Packet<T, Y> {

    private final HashMap<T, Y> data;

    public Packet(HashMap<T, Y> data){
        this.data = data;
    }

    public String toJSON(){
        JSONObject jsonObject = new JSONObject();
        for(Map.Entry<T, Y> entry : data.entrySet()){
            jsonObject.put(entry.getKey(), entry.getValue());
        }
        return jsonObject.toJSONString();
    }

    public JSONObject toJSONObject(){
        JSONObject jsonObject = new JSONObject();
        for(Map.Entry<T, Y> entry : data.entrySet()){
            jsonObject.put(entry.getKey(), entry.getValue());
        }
        return jsonObject;
    }

}
