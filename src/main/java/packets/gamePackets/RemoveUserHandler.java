package packets.gamePackets;

import accounts.UserProfile;

/**
 * Created by Worker2 on 22.05.2018.
 */
@FunctionalInterface
public interface RemoveUserHandler {
    public void removeUser(String login, String target);
}
