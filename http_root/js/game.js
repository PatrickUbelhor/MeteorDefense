
// Create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

// Our game's configuration
let config = {
    type: Phaser.AUTO,  // Phaser will decide how to render our game (WebGL or Canvas)
    width: 640, // game width
    height: 360, // game height
    scene: gameScene // our newly created scene
};

// Create the game, and pass it the configuration
let game = new Phaser.Game(config);


// Load asset files for our game
gameScene.preload = function() {
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('dragon', 'assets/dragon.png');
    this.load.image('treasure', 'assets/treasure.png');
};

// Executed once, after assets were loaded
gameScene.create = function() {
    let background = this.add.sprite(0, 0, 'background');
    background.setOrigin(0, 0);

    this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');
    this.player.setScale(0.5); // Set image scale to half size
}
