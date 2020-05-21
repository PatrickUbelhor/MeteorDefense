package com.patrickubelhor.meteordefense;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Table(name = "scores")
@Entity
public class ScoreListing {

	@Id
	@GeneratedValue
	private Integer id;
	private String username;
	private Integer score;
	
	
	public ScoreListing() {}
	
	
	public ScoreListing(String username, int score) {
		this.username = username;
		this.score = score;
	}
	
	
	public Integer getId() {
		return id;
	}
	
	
	public String getUsername() {
		return username;
	}
	
	
	public int getScore() {
		return score;
	}
	
	
	public void setId(int id) {
		this.id = id;
	}
	
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	
	public void setScore(int score) {
		this.score = score;
	}

}
