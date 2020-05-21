package com.patrickubelhor.meteordefense;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ScoreRepository extends CrudRepository<ScoreListing, Integer> {
	
	@Query(
			value = "SELECT * FROM scores ORDER BY score DESC LIMIT 10",
			nativeQuery = true
	)
	public List<ScoreListing> getLeaderboard();
	
}
