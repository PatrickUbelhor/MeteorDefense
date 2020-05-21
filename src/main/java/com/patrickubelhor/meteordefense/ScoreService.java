package com.patrickubelhor.meteordefense;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoreService {
	
	private final ScoreRepository scoreRepository;
	
	
	@Autowired
	public ScoreService(ScoreRepository scoreRepository) {
		this.scoreRepository = scoreRepository;
	}
	
	
	public void saveScore(String username, int score) {
		ScoreListing listing = new ScoreListing(username, score);
		scoreRepository.save(listing);
	}
	
	
	public List<ScoreListing> getLeaderboard() {
		return scoreRepository.getLeaderboard();
	}
	
}
