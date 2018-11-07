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
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Worker2 on 23.10.2017.
 * User auth
 */
public class SignInServlet extends HttpServlet {

    private final AccountServise accountServise;


    public SignInServlet(AccountServise accountServise) {
        this.accountServise = accountServise;
    }


    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String login = request.getParameter("login");
        String pass = request.getParameter("pass");

        UserProfile userProfile = accountServise.getUserByLogin(login);
        if(userProfile == null || !pass.equals(userProfile.getPassword())){
            response.setContentType("application/json");
            response.getWriter().println("{\"response\":\"error\"}");
            return;
        }

        String sid = MD5Util.MD5Hash(login + "--" + pass);
        accountServise.addSessionId(sid, userProfile);

        response.addCookie(new Cookie("sid", sid));
        response.setContentType("text/html;charset=utf-8");
        response.setStatus(HttpServletResponse.SC_OK);

        response.getWriter().println("{\"response\":\"ok\"}");

    }
}
