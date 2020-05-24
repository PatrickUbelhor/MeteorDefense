import '../css/App.css';
import React from 'react';
import Server from '../api/Server';
import Game from './Game';
import Header from './Header';
import Leaderboard from './Leaderboard';
import Submit from './Submit';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			topComponent: <div>Meteor Defense</div>
		};
	}


	onScoreSubmit = async (username, score) => {
		let leaderboardReq = await Server.put('/leaderboard', {},{
			headers: {
				username: username,
				score: score
			}
		});

		this.setState({
			topComponent: <Leaderboard entries={leaderboardReq.data} />
		});
	}


	onGameEnd = (score) => {
		this.setState({
			topComponent: <Submit score={score} onSubmit={this.onScoreSubmit} />
		});
	}


	render() {
		return (
			<div>
				<Header />
				<div className="content">
					{this.state.topComponent}
					<Game onEnd={this.onGameEnd} />
				</div>
			</div>
		);
	}

}

export default App;
