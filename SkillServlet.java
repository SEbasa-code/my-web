import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Statement;
import org.json.JSONObject;

@WebServlet("/skill")
public class SkillServlet extends HttpServlet {

    // Handle POST requests to add a new skill
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Reading the JSON data from the request body
        StringBuilder sb = new StringBuilder();
        String line;
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        // Parse the JSON
        JSONObject data = new JSONObject(sb.toString());

        // Extracting skill details from the request body
        String skillName = data.getString("skillName");
        int skillLevel = data.getInt("skillLevel");

        String jdbcUrl = "jdbc:mysql://localhost:3306/cv_project";
        String dbUsername = "root";
        String dbPassword = "";

        // Database connection and data insertion
        try (Connection conn = DriverManager.getConnection(jdbcUrl, dbUsername, dbPassword)) {
            String sql = "INSERT INTO skills (skill_name, skill_level) VALUES (?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                stmt.setString(1, skillName);
                stmt.setInt(2, skillLevel);

                int rowsInserted = stmt.executeUpdate();
                if (rowsInserted > 0) {
                    try (var generatedKeys = stmt.getGeneratedKeys()) {
                        if (generatedKeys.next()) {
                            long id = generatedKeys.getLong(1);
                            // Sending success response
                            response.setContentType("application/json");
                            response.getWriter().write("{\"success\": true, \"id\": " + id + "}");
                        }
                    }
                } else {
                    response.setContentType("application/json");
                    response.getWriter().write("{\"success\": false, \"message\": \"Failed to add skill.\"}");
                }
            } catch (Exception e) {
                response.setContentType("application/json");
                response.getWriter().write("{\"success\": false, \"message\": \"Database error: " + e.getMessage() + "\"}");
            }
        } catch (Exception e) {
            response.setContentType("application/json");
            response.getWriter().write("{\"success\": false, \"message\": \"Connection failed: " + e.getMessage() + "\"}");
        }
    }
}
