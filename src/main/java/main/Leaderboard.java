package main;

import java.io.IOException;

import java.io.PrintWriter;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author Patrick Ubelhor
 * @version 04/19/2018
 */
public class Leaderboard extends HttpServlet {
	private java.sql.Connection conn;
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		final String createTableSql =
			"CREATE TABLE IF NOT EXISTS scores ( " +
			"username VARCHAR(32), " +
			"score INT NOT NULL, " + // TODO: Make unsigned, maybe smaller
			"PRIMARY KEY (username) )";
		
		final String createScoreSql = "INSERT INTO scores (username, score) VALUES (?, ?)";
		final String selectSql = "SELECT username, score FROM scores ORDER BY score DESC LIMIT 10";
		
		PrintWriter out = response.getWriter();
		response.setContentType("text/plain");
		// TODO: get username from request
		// TODO: get score from request
		
		String username = request.getHeader("username");
		Integer score = request.getIntHeader("score");
		
		/* TODO: respond in some way if username or score is null
		 * Probably just want to return the leaderboard page; assume user isn't posting a score.
		 */
		
		try (PreparedStatement statementCreateScore = conn.prepareStatement(createScoreSql)) {
			conn.createStatement().executeUpdate(createTableSql);
			statementCreateScore.setString(1, username);
			statementCreateScore.setInt(2, score);
			statementCreateScore.executeUpdate();
			
			try (ResultSet rs = conn.prepareStatement(selectSql).executeQuery()) {
				out.print("Highest 10 scores:\n");
				while (rs.next()) {
					String savedName = rs.getString("username");
					String savedScore = rs.getString("score");
					out.print("User: " + savedName + "  Score: " + savedScore + "\n");
				}
			}
		} catch (SQLException e) {
			throw new ServletException("SQL error", e);
		}
		
	}
	
	
	@Override
	public void init() throws ServletException {
		try {
			String url;
			
			Properties properties = new Properties();
			try {
				properties.load(getServletContext().getResourceAsStream("/WEB-INF/classes/config.properties"));
				url = properties.getProperty("sqlUrl");
			} catch (IOException e) {
				log("No property", e); // Servlet init should never fail
				return;
			}
			
			log("Connecting to: " + url);
			try {
				Class.forName("com.mysql.jdbc.Driver");
				conn = DriverManager.getConnection(url);
			} catch (ClassNotFoundException e) {
				throw new ServletException("Error loading JDBC Driver", e);
			} catch (SQLException e) {
				throw new ServletException("Unable to connect to MySQL", e);
			}
			
		} finally {
			// "Nothing really to do here." - Google
		}
	}
	
}
