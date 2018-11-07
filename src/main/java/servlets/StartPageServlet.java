package servlets;

import accounts.AccountServise;
import accounts.UserProfile;
import freemarker.template.TemplateException;
import game.Room;
import templater.PageGenerator;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Worker2 on 23.10.2017.
 */
public class StartPageServlet extends HttpServlet {

    private final AccountServise accountServise;

    public StartPageServlet(AccountServise accountServise) {
        this.accountServise = accountServise;
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{

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
        String roomId = "none";

        if (profile == null) {
            response.setContentType("text/html;charset=utf-8");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.sendRedirect(response.encodeRedirectURL("/"));
        } else {
            pageVariables.put("User", profile.getLogin());
            pageVariables.put("sid", sid);
            pageVariables.put("UserID", profile.getUserId());

            Room room = profile.getRoom();
            if(room != null) roomId = room.getRoomId();
            pageVariables.put("roomId", roomId);

            response.setContentType("text/html;charset=utf-8");

            response.setStatus(HttpServletResponse.SC_OK);
            try {
                response.getWriter().println(PageGenerator.instance().getPage("startPage.html", pageVariables));
            } catch (TemplateException e) {
                e.printStackTrace();
            }
        }



    }

}
