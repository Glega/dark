package servlets;


import accounts.AccountServise;
import game.MessageService;

import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;
import sockets.GameSocket;

import javax.servlet.annotation.WebServlet;

/**
 * Created by Worker2 on 24.10.2017.
 */
@WebServlet(name="SocketServlet", urlPatterns = {"/api"})
public class SocketServlet extends WebSocketServlet{
    private final static int LOGOUT_TIME = 30 * 60 * 1000;
    private final MessageService messageService;
    private final AccountServise accountServise;

    public SocketServlet(AccountServise accountServise) {
        this.messageService = new MessageService(accountServise);
        this.accountServise = accountServise;
    }

    @Override
    public void configure(WebSocketServletFactory factory) {
        factory.getPolicy().setIdleTimeout(LOGOUT_TIME);
        factory.setCreator((req, resp) -> new GameSocket(messageService, accountServise));
    }
}
