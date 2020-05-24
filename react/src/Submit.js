import './css/Submit.css';
import React from 'react';

class Submit extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			onSubmit: props.onSubmit,
			score: props.score,
			username: ''
		};
	}


	onFormSubmit = (event) => {
		event.preventDefault();
		let strippedName = this.state.username.replace(/\s+/g, '');
		this.state.onSubmit(strippedName, this.state.score);
	}


	render() {
		return (
			<div id="submitDiv">
				<div id="score">Your score was {this.state.score}!</div>
				<div id="label">Username</div>
				<input
					type="text"
					id="usernameField"
					value={this.state.username}
					onChange={(event) => this.setState({ username: event.target.value })}
					maxLength={3}
				/>
				<button id="submitButton" type="button" onClick={this.onFormSubmit}>Submit</button>
			</div>
		);
	}

}

export default Submit;
