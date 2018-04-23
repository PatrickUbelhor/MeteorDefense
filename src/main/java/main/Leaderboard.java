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
 * @version 04/23/2018
 */
public class Leaderboard extends HttpServlet {
	private java.sql.Connection conn;
	
	@Override
	public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		
		final String createTableSql =
			"CREATE TABLE IF NOT EXISTS scores ( " +
			"username VARCHAR(32), " +
			"score INT NOT NULL, " + // TODO: Make unsigned, maybe smaller
			"PRIMARY KEY (username) )";
		
		final String createScoreSql =
			"INSERT INTO scores (username, score) " +
			"VALUES(?, ?) " +
			"ON DUPLICATE KEY UPDATE " +
			"score = GREATEST(score, VALUES(score))";
		
		String username = request.getHeader("username");
		int score = request.getIntHeader("score");
		
		try (PreparedStatement statementCreateScore = conn.prepareStatement(createScoreSql)) {
			conn.createStatement().executeUpdate(createTableSql);
			statementCreateScore.setString(1, username);
			statementCreateScore.setInt(2, score);
			statementCreateScore.executeUpdate();
		} catch (SQLException e) {
			throw new ServletException("SQL error", e);
		}
	}
	
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		
		final String selectSql = "SELECT username, score FROM scores ORDER BY score DESC LIMIT 10";
		
		PrintWriter out = response.getWriter();
		response.setContentType("text/plain");
		
		try (ResultSet rs = conn.prepareStatement(selectSql).executeQuery()) {
			out.print("Highest 10 scores:\n");
			while (rs.next()) {
				String savedName = rs.getString("username");
				String savedScore = rs.getString("score");
				out.print("User: " + savedName + "  Score: " + savedScore + "\n");
			}
		} catch (SQLException e) {
			throw new ServletException("SQL error", e);
		}
	}
	
	
	@Override
	public void init() throws ServletException {
		try {
			String instance;
			String user;
			String password;
			String database;
			String url;
			
			Properties properties = new Properties();
			try {
				properties.load(getServletContext().getResourceAsStream("/WEB-INF/config.properties"));
				instance = properties.getProperty("instanceConnectionName");
				user = properties.getProperty("user");
				password = properties.getProperty("password");
				database = properties.getProperty("database");
				
				if (instance == null || instance.isEmpty()
					|| user == null || user.isEmpty()
					|| password == null || password.isEmpty()
					|| database == null || database.isEmpty()) {
					
					throw new IOException("Empty parameter");
				}
				
				url =
					"jdbc:mysql://google/" + database +
					"?cloudSqlInstance=" + instance +
					"&socketFactory=com.google.cloud.sql.mysql.SocketFactory&user=" + user +
					"&password=" + password +
					"&useSSL=false";
				
				
			} catch (IOException e) {
				log("No property", e); // Servlet init should never fail
				return;
			}
			
//			log("Connecting to: " + url); Leaving commented out to prevent password from being logged
			log("Connecting to: " + instance);
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
