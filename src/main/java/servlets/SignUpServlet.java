package servlets;

import accounts.AccountServise;
import accounts.UserProfile;
import util.MD5Util;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by Worker2 on 23.10.2017.
 * User registration
 * login, password, nickname*
 *
 */
public class SignUpServlet extends HttpServlet {
    private final AccountServise accountServise;

    public SignUpServlet(AccountServise accountServise) {
        this.accountServise = accountServise;
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{

        //Get user params
        String login = request.getParameter("login");
        String pass = request.getParameter("pass");
        String nickName = request.getParameter("nickName");


        UserProfile userProfile = accountServise.getUserByLogin(login);

        if(userProfile != null){
            response.setContentType("application/json");
            response.getWriter().println("{\"response\":\"user exists\"}");
            return;
        }

        userProfile = new UserProfile(login, pass);

        accountServise.addUser(userProfile);

        String sid = MD5Util.MD5Hash(login + "--" + pass);
        accountServise.addSessionId(sid, userProfile);

        response.addCookie(new Cookie("sid", sid));
        userProfile.setNickName(nickName);


        response.setContentType("text/html;charset=utf-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.sendRedirect(response.encodeRedirectURL(request.getContextPath() + "/game"));
    }
}
