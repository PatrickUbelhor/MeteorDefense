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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class Controller {
	
	private static final Logger logger = LogManager.getLogger(Controller.class);
	
	private final ScoreService scoreService;
	
	
	@Autowired
	public Controller(ScoreService scoreService) {
		this.scoreService = scoreService;
	}
	
	
	@PutMapping("/leaderboard")
	public ResponseEntity<List<ScoreListing>> postScore(
			@RequestHeader("username") String username,
			@RequestHeader("score") Integer score
	) {
		
		logger.info("{}: {}", username, score);
		scoreService.saveScore(username, score);
		
		return ResponseEntity.ok(scoreService.getLeaderboard());
	}
	
	
	@GetMapping("/leaderboard")
	public ResponseEntity<List<ScoreListing>> getLeaderboard() {
		return ResponseEntity.ok(scoreService.getLeaderboard());
	}
	
}
