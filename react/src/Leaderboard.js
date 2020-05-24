import React from 'react';

function Leaderboard(props) {

	let rows = [];
	for (let i = 0; i < props.entries.length; i++) {
		let row = (
			<tr>
				<th>{props.entries[i].username}</th>
				<th>{props.entries[i].score}</th>
			</tr>
		);

		rows.push(row);
	}

	return (
		<div>
			<div>Leaderboard Top 10</div>
			<table>
				<tr>
					<th>Name</th>
					<th>Score</th>
				</tr>
				{rows}
			</table>
		</div>
	);

}

export default Leaderboard;
