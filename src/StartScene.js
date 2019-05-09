class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: 'StartScene' })
	}

	preload() {
    this.load.image('bg', './assets/space1.png');
    // this.load.image('bg', './assets/bkgd_0.png');
    this.load.image('bg2', './assets/bkgd_1.png');
    this.load.image('bg3', './assets/bkgd_4.png');
		this.load.image('still', './assets/gameStill.png')

    //this.load.image('bullet', 'assets/sprites/purple_ball.png')

    this.load.multiatlas('alien', './assets/alien.json', 'assets');

  }

	create() {
		gameState.bg = this.add.tileSprite(0, 0, 0, 0, 'bg').setOrigin(0, 0);
    gameState.bg2 = this.add.tileSprite(0, 0, 0, 0, 'bg2').setOrigin(0, 0);
    gameState.bg3 = this.add.tileSprite(0, 0, 0, 0, 'bg3').setOrigin(0, -100);
    gameState.bg.setScale(1.25);

		// this.add.image(config.width / 2, config.height / 2, 'still')

		gameState.player = this.add.sprite(config.width / 3, config.height / 2, 'alien', 'idle/01').setScale(.8);

			const walkFrames = this.anims.generateFrameNames('alien', {
      	start: 1, end: 6, zeroPad: 2, prefix: 'walk/'
    	})
    	this.anims.create({key: 'walk', frames: walkFrames, frameRate: 10, repeat: -1 })

		gameState.player.anims.play('walk')

		this.add.text((config.width / 2) - 60, (config.height / 2) - 60, `
			Hey, ${gameState.playerName}
			Click to start`, { fontSize: '30px', fill: '#b37329' });

		fetch('http://localhost:3000/scores')
			.then(res => res.json())
			.then(scores => {console.log(scores);
				for(let i = 0; i < scores.length; i++) {
					this.add.text((config.width / 2) - 30, (config.height / 2) + 60 + (15*i), `${i+1}. ${scores[i].player.name}   ${scores[i].score}`)
				}
			})



		this.input.on('pointerdown', () => {
			gameState.score = 0;
			this.scene.stop('StartScene')
			this.scene.start('GameScene')
		})
	}

	update(time, delta) {

    gameState.bg2.tilePositionX += 6;
    gameState.bg3.tilePositionX += 11;
	}
}
