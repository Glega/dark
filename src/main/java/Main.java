import accounts.AccountServise;
import accounts.UserProfile;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import packets.ActivateFunction;
import packets.NNFucntion;
import servlets.*;

/**
 * Created by Worker2 on 23.03.2018.
 */
public class Main {

    static boolean isDebug = true;

    static public void main(String[] args) throws Exception {


        AccountServise accountServise = new AccountServise();
        accountServise.addUser(new UserProfile("admin", "admin"));
        accountServise.addUser(new UserProfile("Fly", "12345"));


        ServletContextHandler contextHandler = new ServletContextHandler(ServletContextHandler.SESSIONS);

        contextHandler.addServlet(new ServletHolder(new SignInServlet(accountServise)),"/signIn");
        contextHandler.addServlet(new ServletHolder(new SignUpServlet(accountServise)), "/signUp");

        contextHandler.addServlet(new ServletHolder(new StartPageServlet(accountServise)), "/game");
        contextHandler.addServlet(new ServletHolder(new SocketServlet(accountServise)), "/api");
        contextHandler.addServlet(new ServletHolder(new GameFrameServlet(accountServise)), "/room/*");



        ResourceHandler resourceHandler = new ResourceHandler();
        resourceHandler.setResourceBase("public_html");


        HandlerList handlers = new HandlerList();
        handlers.setHandlers(new Handler[]{resourceHandler, contextHandler});

        Server server = new Server(8080);

        server.setHandler(handlers);
        server.start();
        server.join();

    }

    static public void debug(Object o){
        if(!isDebug) return;
        System.out.println(o);
    }

}
