import '../css/Leaderboard.css';
import React from 'react';

function Leaderboard(props) {

	let rows = [];
	for (let i = 0; i < props.entries.length; i++) {
		let row = (
			<tr key={i}>
				<th>{props.entries[i].username}</th>
				<th>{props.entries[i].score}</th>
			</tr>
		);

		rows.push(row);
	}

	return (
		<div id="leaderboardDiv">
			<div id="leaderboardTitle">Leaderboard Top 10</div>
			<table id="leaderboardTable">
				<thead id="leaderboardHead">
					<tr>
						<th>Name</th>
						<th>Score</th>
					</tr>
				</thead>
				<tbody id="leaderboardBody">
					{rows}
				</tbody>
			</table>
		</div>
	);

}

export default Leaderboard;
