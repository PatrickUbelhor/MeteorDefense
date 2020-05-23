import './css/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
// import Phaser from "phaser";
import App from './App';

// import backgroundImg from './assets/background.png'
// import barrelImg from './assets/barrel.png'
// import baseImg from './assets/base.png'
// import bulletImg from './assets/bullet.png'
// import meteor1Img from './assets/meteor1.png'
//
// // ReactDOM.render(
// // 	<React.StrictMode>
// // 		<App/>
// // 	</React.StrictMode>,
// // 	document.getElementById('root')
// // );
//
// // Create a new scene named "Game"
// let ROOT = "http://localhost:8080/";
// let scene = new Phaser.Scene('Game');
//
// // Our game's configuration
// const config = {
// 	type: Phaser.AUTO,  // Phaser will decide how to render our game (WebGL or Canvas)
// 	width: 1280, // game width
// 	height: 720, // game height
// 	scene: scene // our newly created scene
// };
//
// // eslint-disable-next-line
// let game = new Phaser.Game(config);
//
//
// /**
//  * Used to initialize custom variables.
//  */
// scene.init = function() {
// 	// Constants
// 	this.bulletSpeed = -20;
// 	this.meteorAngularVelBase = 0.2;
// 	this.meteorAngularVelRange = 4;
// 	this.meteorSpeedMultiplier = 3;
// 	this.meteorSpeedBase = 2;
// 	this.meteorSpawnLowest = -50;
// 	this.meteorSpawnRangeY = 50;
// 	this.meteorSpawnCenter = this.sys.game.config.width / 2;
// 	this.meteorSpawnRangeX = this.sys.game.config.width / 1.5;
// 	this.maxNumMeteors = 5;
//
// 	// Variables
// 	this.score = 0;
// 	// this.playerHealth = 10;
// };
//
//
// /**
//  * Buffers the images/assets for future use.
//  */
// scene.preload = function() {};
//
//
// /**
//  * Places initial objects on the scene (runs once).
//  */
// scene.create = function() {};
//
//
// /**
//  * Runs once every time the screen is refreshed (optimally 60Hz). Important
//  * to isolate timing from iteration count.
//  */
// scene.update = function() {
// 	if (this.playerHealth <= 0) {
// 		return;
// 	}
//
// 	let meteors = this.meteors.getChildren();
//
// 	let deltaX = this.barrel.x - this.input.activePointer.x;
// 	let deltaY = this.barrel.y - this.input.activePointer.y;
// 	let angle = Math.atan2(deltaY, deltaX) - (Math.PI / 2); // Rotate 90 degrees so y axis is polar 0
// 	this.barrel.angle = radToDeg(angle);
//
// 	// Move bullet and check for intersection with meteors
// 	this.bullet.x += this.bullet.speedX;
// 	this.bullet.y += this.bullet.speedY;
// 	for (let i = 0; i < this.maxNumMeteors; i++) {
// 		if (Phaser.Geom.Intersects.RectangleToRectangle(this.bullet.getBounds(), meteors[i].getBounds())) {
// 			this.resetMeteor(meteors[i]);
// 			this.resetBullet(this.bullet);
// 			this.score++;
// 			break;
// 		}
// 	}
//
// 	if (!Phaser.Geom.Intersects.RectangleToRectangle(this.bullet.getBounds(), this.backgr.getBounds())) {
// 		this.resetBullet(this.bullet);
// 	}
//
// 	// Move meteor and check for intersection with bunker
// 	for (let i = 0; i < this.maxNumMeteors; i++) {
// 		meteors[i].y += meteors[i].speed;
// 		meteors[i].angle += meteors[i].angularVel;
// 		if (Phaser.Geom.Intersects.RectangleToRectangle(meteors[i].getBounds(), this.bunker.getBounds())) {
// 			this.playerHealth--;
// 			this.resetMeteor(meteors[i]);
// 		}
//
// 		// Reset meteor if it hit the ground
// 		if (meteors[i].y >= this.sys.game.config.height) {
// 			this.resetMeteor(meteors[i]);
// 		}
// 	}
//
// 	// End if health is 0
// 	if (this.playerHealth <= 0) {
// 		this.gameOver();
// 	}
// };
//
//
// /**
//  * Called in scene.update() when the player has lost.
//  */
// scene.gameOver = function() {
// 	// Fade camera
// 	this.time.delayedCall(100, function() {
// 		this.cameras.main.fade(400);
// 	}, [], this);
//
// 	// Restart game
// 	this.time.delayedCall(500, function() {
// 		// this.scene.restart();
// 		window.location.replace(ROOT + "submit?score=" + this.score);
// 	}, [], this);
// };


ReactDOM.render(<App/>, document.getElementById('root'));
