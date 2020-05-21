package com.patrickubelhor.meteordefense;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/v1", produces = MediaType.APPLICATION_JSON_VALUE)
public class Controller {
	
	private static final Logger logger = LogManager.getLogger(Controller.class);
	
	private final ScoreService scoreService;
	
	
	@Autowired
	public Controller(ScoreService scoreService) {
		this.scoreService = scoreService;
	}
	
	
	@GetMapping(value = "/submit", produces = MediaType.TEXT_HTML_VALUE)
	public ResponseEntity<String> submit(@RequestParam("score") Integer score) {
		String response =
				"<!DOCTYPE html>\n\n" +
						"<html>\n" +
						"<body>\n" +
						"<h1>Your score was %d!</h1>\n" +
						"Username<br>\n" +
						"<input type=\"text\" id=\"nameText\" value =\"\"><br><br>\n" +
						"<button type=\"button\" onclick=\"sendScore()\">Try it</button>\n" +
						"<script>\n" +
						"function sendScore() {\n" +
						"   var request = new XMLHttpRequest();\n" +
						"   request.open('PUT', \"http://localhost:8080/api/v1/leaderboard\", false);\n" +
						"   request.setRequestHeader(\"username\", document.getElementById(\"nameText\").value);\n" +
						"   request.setRequestHeader(\"score\", %d);\n" +
						"   request.send();\n" +
						"   window.location.replace(\"http://localhost:8080/api/v1/leaderboard\");\n" +
						"}\n" +
						"</script>\n" +
						"</body>\n" +
						"</html>";
		
		return ResponseEntity.ok(String.format(response, score, score));
	}
	
	
	@PutMapping("/leaderboard")
	public ResponseEntity<Void> postScore(
			@RequestHeader("username") String username,
			@RequestHeader("score") Integer score
	) {
		
		logger.info("{}: {}", username, score);
		scoreService.saveScore(username, score);
		
		return ResponseEntity.ok().build();
	}
	
	
	@GetMapping(value = "/leaderboard", produces = MediaType.TEXT_HTML_VALUE)
	public ResponseEntity<String> getLeaderboard() {
		
		List<ScoreListing> leaderboard = scoreService.getLeaderboard();
		String tableRow = "<tr><th>%s</th><th>%s</th></tr>";
		String table = leaderboard.stream()
				.map(scoreListing -> String.format(tableRow, scoreListing.getUsername(), scoreListing.getScore()))
				.collect(Collectors.joining());
		
		String response =
				"<!DOCTYPE html>\n" +
						"<html>\n" +
						"<body>\n" +
						"<h1>Leaderboard Top 10</h1>\n" +
						"<table style=\"width:25%\">\n" +
						"   <tr>\n" +
						"       <th>Name</th>\n" +
						"       <th>Score</th>\n" +
						"   </tr>\n" +
						table +
						"</table>" +
						"</body>" +
						"</html>";
		
		return ResponseEntity.ok(response);
	}
	
}
