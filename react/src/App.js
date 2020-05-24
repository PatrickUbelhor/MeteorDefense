import './css/App.css';
import React from 'react';
import Server from './api/Server';
import Game from './Game';
import Submit from './Submit';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			topComponent: <div>Meteor Defense</div>
		};
	}


	onScoreSubmit = async (username, score) => {
		let leaderboard = await Server.put('/leaderboard', {
			headers: {
				username: username,
				score: score
			}
		});
	}


	updateScore = (score) => {
		let submit = <Submit score={score} onSubmit={this.onScoreSubmit} />;
		this.setState({
			topComponent: submit
		});
	}


	render() {
		return (
			<div>
				{this.state.topComponent}
				<Game onEnd={this.updateScore} />
			</div>
		);
	}

}

export default App;
