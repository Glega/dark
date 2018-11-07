package sockets;

import accounts.AccountServise;
import game.MessageService;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.json.simple.parser.ParseException;
import packets.IDisconnectPacket;

/**
 * Created by Worker2 on 24.10.2017.
 */
@SuppressWarnings("UnusedDeclaration")
@WebSocket
public class GameSocket {

    private MessageService messageService;
    private Session session;
    private String sid;
    private final AccountServise accountServise;

    private IDisconnectPacket onDisconnect;

    public GameSocket(MessageService messageService, AccountServise accountServise) {
        this.messageService = messageService;
        this.accountServise = accountServise;
    }

    @OnWebSocketConnect
    public void onOpen(Session session) {
        this.session = session;
        //Debugger.debug(this + " connected...");
    }

    @OnWebSocketMessage
    public void onMessage(String data) {
        try {
            messageService.parseMessage(data, this);
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    @OnWebSocketClose
    public void onClose(int statusCode, String reason) {
        onDisconnect.apply(this);
    }


    public void setDisconnectHandler(IDisconnectPacket p){
        onDisconnect = p;
    }

    public void sendString(String data) {
        try {
            session.getRemote().sendString(data);
        } catch (Exception e) {
            System.out.println("Err - " + e.getMessage());
        }
    }

}
