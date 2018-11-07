package packets.gamePackets;

/**
 * Created by Worker2 on 22.05.2018.
 */
@FunctionalInterface
public interface GameMessagePackets {
    public void sendMessage(String roomId, String JSONMsg);
}
