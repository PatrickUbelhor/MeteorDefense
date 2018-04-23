// Create a new scene named "Game"
let ROOT = "https://meteor-defense.appspot.com";
let scene = new Phaser.Scene('Game');

// Our game's configuration
let config = {
	type: Phaser.AUTO,  // Phaser will decide how to render our game (WebGL or Canvas)
	width: 1280, // game width
	height: 720, // game height
	scene: scene // our newly created scene
};

let game = new Phaser.Game(config);


/**
 * Used to initialize custom variables.
 */
scene.init = function() {
	// Constants
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

	// Variables
	this.score = 0;
	this.playerHealth = 10;
};

/**
 * Buffers the images/assets for future use.
 */
scene.preload = function() {
	this.load.image('background', 'assets/background.png');
	this.load.image('bullet', 'assets/bullet.png');
	this.load.image('meteor', 'assets/meteor1.png');
	this.load.image('bunker', 'assets/base.png');
	this.load.image('barrel', 'assets/barrel.png');
};

/**
 * Places initial objects on the scene (runs once).
 */
scene.create = function() {
	this.backgr = this.add.sprite(0, 0, 'background');
	this.backgr.setOrigin(0, 0);
	this.backgr.setScale(0.5);

	// Create bullet
	this.bullet = this.add.sprite(0, 0, 'bullet');
	this.bullet.setScale(1);
	this.resetBullet(this.bullet);

	// Create turret barrel
	// TODO: Make this scale proportionally
	this.barrel = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height - 80, 'barrel');
	this.barrel.setScale(1);

	// TODO: Scale offset based on percent of screen height, and make that percent a constant
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
	this.playerHealth = 10;
	this.score = 0;
};

/**
 * Runs once every time the screen is refreshed (optimally 60Hz). Important
 * to isolate timing from iteration count.
 */
scene.update = function() {
	if (this.playerHealth <= 0) {
		return;
	}

	let meteors = this.meteors.getChildren();

	let deltaX = this.barrel.x - this.input.activePointer.x;
	let deltaY = this.barrel.y - this.input.activePointer.y;
	let angle = Math.atan2(deltaY, deltaX) - (Math.PI / 2); // Rotate 90 degrees so y axis is polar 0
	this.barrel.angle = radToDeg(angle);

	if (this.input.activePointer.justDown && !this.bullet.isMoving) {
		this.shoot(angle);
	}

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

	if (!Phaser.Geom.Intersects.RectangleToRectangle(this.bullet.getBounds(), this.backgr.getBounds())) {
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
		this.scene.restart();
		// window.location.replace("http://www.google.com");
	}, [], this);
};

scene.shoot = function(angle) {
	this.bullet.speedX = -Math.sin(angle) * this.bulletSpeed;
	this.bullet.speedY = Math.cos(angle) * this.bulletSpeed;
	this.bullet.angle = radToDeg(angle);
	this.bullet.isMoving = true;
};

scene.resetMeteor = function(meteor) {
	meteor.x = (Math.random() - 0.5) * this.meteorSpawnRangeX + this.meteorSpawnCenter;
	meteor.y = -Math.random() * this.meteorSpawnRangeY + this.meteorSpawnLowest;
	meteor.speed = Math.random() * this.meteorSpeedMultiplier + this.meteorSpeedBase;
	meteor.angularVel = (Math.random() - 0.5) * this.meteorAngularVelRange + this.meteorAngularVelBase;
};

scene.resetMeteors = function(meteors) {
	let len = meteors.length;
	for (let i = 0; i < len; i++) {
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

radToDeg = function(angle) {
	return (360 * angle / (2 * Math.PI));
};