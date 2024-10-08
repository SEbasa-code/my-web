import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {

    // JDBC Database connection
    private Connection getConnection() {
        Connection con = null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver"); // MySQL JDBC Driver for MySQL 8.x
            String jdbcUrl = "jdbc:mysql://localhost:3306/register";
            String username = "root";
            String password = "";

            con = DriverManager.getConnection(jdbcUrl, username, password);
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
        return con;
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Retrieve form data
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        // Get the connection
        Connection con = getConnection();

        // Respond to the client (HTML response)
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        if (con != null) {
            // For now, just print a success message
            out.println("<h2>Connection Successful!</h2>");
            out.println("<p>Database connected with username: " + username + "</p>");
        } else {
            out.println("<h2>Connection Failed!</h2>");
        }

        con.close();
    }
}
