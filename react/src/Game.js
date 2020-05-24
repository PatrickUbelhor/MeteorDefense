import React from 'react';
import Phaser from 'phaser';
import backgroundImg from './assets/background.png';
import barrelImg from './assets/barrel.png';
import baseImg from './assets/base.png';
import bulletImg from './assets/bullet.png';
import meteor1Img from './assets/meteor1.png';


export default class Game extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			sendScore: props.onEnd
		}
	}


	componentDidMount() {
		let scene = new Phaser.Scene('Game');
		let sendScore = this.state.sendScore;
		let radToDeg = function(angle) {
			return (360 * angle / (2 * Math.PI));
		};

		const config = {
			type: Phaser.AUTO,
			width: 1280,
			height: 720,
			scene: scene
		};

		scene.init = function() {
			this.bulletSpeed = -20;
			this.meteorAngularVelBase = 0.2;
			this.meteorAngularVelRange = 4;
			this.meteorSpeedMultiplier = 3;
			this.meteorSpeedBase = 2;
			this.meteorSpawnLowest = -50;
			this.meteorSpawnRangeY = 50;
			this.meteorSpawnCenter = this.sys.game.config.width / 2;
			this.meteorSpawnRangeX = this.sys.game.config.width / 1.5;
			this.maxNumMeteors = 5;
		};

		/**
		 * Buffers images/assets
		 */
		scene.preload = function() {
			this.load.image('background', backgroundImg);
			this.load.image('barrel', barrelImg);
			this.load.image('bunker', baseImg)
			this.load.image('bullet', bulletImg);
			this.load.image('meteor', meteor1Img);
		};

		/**
		 * Places initial objects on the scene
		 */
		scene.create = function() {
			this.background = this.add.sprite(0, 0, 'background');
			this.background.setOrigin(0, 0);
			this.background.setScale(0.5);

			this.bullet = this.add.sprite(0, 0, 'bullet');
			this.bullet.setScale(1);
			this.resetBullet(this.bullet);

			// TODO: make this scale proportionally
			this.barrel = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height - 80, 'barrel');
			this.barrel.setScale(1);

			// TODO: Scale offset based on percent of screen height
			this.bunker = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height - 80, 'bunker');
			this.bunker.setScale(1.75);

			// Create meteors
			this.meteors = this.add.group({
				key: 'meteor',
				repeat: this.maxNumMeteors,
				setXY: {
					x: 0,
					y: this.meteorSpawnLowest,
					stepX: 0,
					stepY: 0
				}
			});
			Phaser.Actions.ScaleXY(this.meteors.getChildren(), -0.6, -0.6);
			this.resetMeteors(this.meteors.getChildren());

			this.cameras.main.resetFX();
			this.playerHealth = 5;
			this.score = 0;

			this.input.on('pointerdown', (pointer) => {
				this.shoot(this.getPointerAngle(pointer.x, pointer.y));
			}, this);
		};

		/**
		 * Runs once every time the screen is refreshed (optimally 60Hz)
		 */
		scene.update = function() {
			if (this.playerHealth <= 0) {
				return;
			}

			let meteors = this.meteors.getChildren();

			let angle = this.getPointerAngle(this.input.activePointer.x, this.input.activePointer.y);
			this.barrel.angle = radToDeg(angle);

			// Move bullet and check for intersection with meteors
			this.bullet.x += this.bullet.speedX;
			this.bullet.y += this.bullet.speedY;
			for (let i = 0; i < this.maxNumMeteors; i++) {
				if (Phaser.Geom.Intersects.RectangleToRectangle(this.bullet.getBounds(), meteors[i].getBounds())) {
					this.resetMeteor(meteors[i]);
					this.resetBullet(this.bullet);
					this.score++;
					break;
				}
			}

			if (!Phaser.Geom.Intersects.RectangleToRectangle(this.bullet.getBounds(), this.background.getBounds())) {
				this.resetBullet(this.bullet);
			}

			// Move meteor and check for intersection with bunker
			for (let i = 0; i < this.maxNumMeteors; i++) {
				meteors[i].y += meteors[i].speed;
				meteors[i].angle += meteors[i].angularVel;
				if (Phaser.Geom.Intersects.RectangleToRectangle(meteors[i].getBounds(), this.bunker.getBounds())) {
					this.playerHealth--;
					this.resetMeteor(meteors[i]);
				}

				// Reset meteor if it hit the ground
				if (meteors[i].y >= this.sys.game.config.height) {
					this.resetMeteor(meteors[i]);
				}
			}

			// End if health is 0
			if (this.playerHealth <= 0) {
				this.gameOver();
			}
		};

		/**
		 * Called in scene.update() when the player has lost.
		 */
		scene.gameOver = function() {
			// Fade camera
			this.time.delayedCall(100, function() {
				this.cameras.main.fade(400);
			}, [], this);

			// Restart game
			this.time.delayedCall(500, function() {
				// this.scene.restart();
				// window.location.replace(ROOT + "submit?score=" + this.score);
				sendScore(this.score);
			}, [], this);
		};

		scene.resetMeteor = function(meteor) {
			meteor.x = (Math.random() - 0.5) * this.meteorSpawnRangeX + this.meteorSpawnCenter;
			meteor.y = -Math.random() * this.meteorSpawnRangeY + this.meteorSpawnLowest;
			meteor.speed = Math.random() * this.meteorSpeedMultiplier + this.meteorSpeedBase;
			meteor.angularVel = (Math.random() - 0.5) * this.meteorAngularVelRange + this.meteorAngularVelBase;
		};

		scene.resetMeteors = function(meteors) {
			for (let i = 0; i < meteors.length; i++) {
				this.resetMeteor(meteors[i]);
			}
		};

		scene.resetBullet = function(bullet) {
			bullet.x = this.sys.game.config.width / 2;
			bullet.y = this.sys.game.config.height - 80; // TODO: Scale offset based on percent of screen height
			bullet.speedX = 0;
			bullet.speedY = 0;
			bullet.isMoving = false;
		};

		scene.shoot = function(angle) {
			this.bullet.speedX = -Math.sin(angle) * this.bulletSpeed;
			this.bullet.speedY = Math.cos(angle) * this.bulletSpeed;
			this.bullet.angle = radToDeg(angle);
			this.bullet.isMoving = true;
		};

		scene.getPointerAngle = function(pointerX, pointerY) {
			let deltaX = this.barrel.x - pointerX;
			let deltaY = this.barrel.y - pointerY;
			return Math.atan2(deltaY, deltaX) - (Math.PI / 2); // Rotate 90 degrees so y axis is polar 0
		}

		// eslint-disable-next-line
		let game = new Phaser.Game(config);
	}

	render() {
		return <div />;
	}

}
