class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: 'StartScene' })
	}

	preload() {
    this.load.image('bg', './assets/space1.png');
    // this.load.image('bg', './assets/bkgd_0.png');
    this.load.image('bg2', './assets/bkgd_1.png');
    this.load.image('bg3', './assets/bkgd_4.png');

    //this.load.image('bullet', 'assets/sprites/purple_ball.png')

    this.load.multiatlas('alien', './assets/alien.json', 'assets');
  }

	create() {
		gameState.bg = this.add.tileSprite(0, 0, 0, 0, 'bg').setOrigin(0, 0);
    gameState.bg2 = this.add.tileSprite(0, 0, 0, 0, 'bg2').setOrigin(0, 0);
    gameState.bg3 = this.add.tileSprite(0, 0, 0, 0, 'bg3').setOrigin(0, -100);
    gameState.bg.setScale(1.25);
		this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Click to start!', { fontSize: '15px', fill: '#2996b3' });
		console.log(this)
		this.input.on('pointerdown', () => {
			this.scene.stop('StarScene')
			this.scene.start('GameScene')
		})
	}
}
