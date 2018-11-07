package accounts;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Worker2 on 18.10.2017.
 */
public class AccountServise {

    private final Map<String, UserProfile> loginToProfile;
    private final Map<String, UserProfile> sessionIdToProfile;
    private final Map<String, UserProfile> idToProfile;

    public AccountServise(){
        loginToProfile = new HashMap();
        sessionIdToProfile = new HashMap();
        idToProfile = new HashMap<>();
    }

    public void addUser(UserProfile userProfile){
        loginToProfile.put(userProfile.getLogin(), userProfile);
        String id = String.valueOf(userProfile.getUserId());
        idToProfile.put(id, userProfile);
    }

    public UserProfile getUserByLogin(String login){
        return loginToProfile.get(login);
    }

    public void addSessionId(String sessionId, UserProfile userProfile){
        sessionIdToProfile.put(sessionId, userProfile);
    }

    public UserProfile getUserBySessionId(String sessionId){
        return sessionIdToProfile.get(sessionId);
    }

    public void removeSession(String sessionId){
        sessionIdToProfile.remove(sessionId);
    }




}
