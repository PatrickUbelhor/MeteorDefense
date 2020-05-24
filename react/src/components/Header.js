import '../css/Header.css';
import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

function Header(Props) {

	return (
		<AppBar id="appBar" position="sticky">
			<Toolbar>
				<Typography id="home" variant="h5" color="inherit">Meteor Defense</Typography>
			</Toolbar>
		</AppBar>
	);
}

export default Header;
