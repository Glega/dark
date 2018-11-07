package servlets;

import accounts.AccountServise;
import accounts.UserProfile;
import freemarker.template.TemplateException;
import game.Room;
import game.RoomService;
import templater.PageGenerator;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Worker2 on 20.05.2018.
 */
public class GameFrameServlet extends HttpServlet{
    private final AccountServise accountServise;
    private final RoomService roomService;

    public GameFrameServlet(AccountServise accountServise){
        this.accountServise = accountServise;
        this.roomService = RoomService.getRoomService();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        Map<String, Object> pageVariables = new HashMap();

        Cookie[] cookies = request.getCookies();
        String sid = "";


        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("sid")) {
                    sid =  cookie.getValue();
                }
            }
        }

        UserProfile profile = accountServise.getUserBySessionId(sid);


        Room room = roomService.getRoom(request.getPathInfo().substring(1));

        if (profile == null) {
            response.sendRedirect(response.encodeRedirectURL("/"));
            return;
        } else {
            pageVariables.put("RoomID", request.getPathInfo().substring(1));
            pageVariables.put("User", profile.getLogin());
            pageVariables.put("sid", sid);
            response.setContentType("text/html;charset=utf-8");
            response.setStatus(HttpServletResponse.SC_OK);

            try {
                response.getWriter().println(PageGenerator.instance().getPage("gameFrame.html", pageVariables));
            } catch (TemplateException e) {
                e.printStackTrace();
            }
        }
    }

}
