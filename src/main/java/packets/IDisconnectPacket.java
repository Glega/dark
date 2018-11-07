package packets;

import sockets.GameSocket;

/**
 * Created by Worker2 on 23.03.2018.
 */
@FunctionalInterface
public interface IDisconnectPacket {

    public void apply(GameSocket gameSocket);

}
