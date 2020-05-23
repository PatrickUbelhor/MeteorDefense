import './css/App.css';
import React from 'react';
import Server from './api/Server';

class App extends React.Component {

	sendScore = async (username, score) => {
		let leaderboard = await Server.put('/leaderboard', {
			headers: {
				username: username,
				score: score
			}
		});
	}

	render() {
		return (
			<div>
				Meteor Defense
			</div>
		);
	}

}

export default App;
