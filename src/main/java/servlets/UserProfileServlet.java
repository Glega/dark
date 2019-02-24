package servlets;

import accounts.AccountServise;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by Worker2 on 25.01.2019.
 */
public class UserProfileServlet extends HttpServlet{

    private final AccountServise accountServise;

    public UserProfileServlet(AccountServise accountServise){
        this.accountServise = accountServise;
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response){
        //TODO
        //Show user profile page


    }

}
