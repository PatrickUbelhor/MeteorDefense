package main;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author Patrick Ubelhor
 * @version 04/24/2018
 */
public class Submit extends HttpServlet {
	
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		final String form =
			"<!DOCTYPE html>\n" +
			"<html>\n" +
			"<body>\n" +
			"<h1>Your score was %d!</h1>\n" +
			"Username<br>\n" +
			"<input type=\"text\" id=\"nameText\" value =\"\"><br><br>\n" +
			"<button type=\"button\" onclick=\"sendScore()\">Try it</button>\n" +
			
			"<script>\n" +
			"function sendScore() {\n" +
			"   var request = new XMLHttpRequest();\n" +
			"   request.open('PUT', \"https://meteor-defense.appspot.com/leaderboard\", false);\n" +
			"   request.setRequestHeader(\"username\", document.getElementById(\"nameText\").value);\n" +
			"   request.setRequestHeader(\"score\", %d);\n" +
			"   request.send();\n" +
			"   window.location.replace(\"https://meteor-defense.appspot.com/leaderboard\");\n" +
			"}\n" +
			"</script>\n" +
			
			"</body>\n" +
			"</html>";
		
		int score = Integer.parseInt(request.getQueryString());
		
		response.setContentType("text/html");
		response.getWriter().printf(form, score, score);
	}
	
}
