console.log('hello world')
// img = document.createElement('img')
// img.src = './assets/alien.png'
// document.querySelector('body').appendChild(img)

const gameState = {};

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('bg', './assets/space1.png');
    // this.load.image('bg', './assets/bkgd_0.png');
    this.load.image('bg2', './assets/bkgd_1.png');
    this.load.image('bg3', './assets/bkgd_4.png');
    this.load.multiatlas('alien', './assets/alien.json', 'assets');
  }

  create() {
    gameState.active = true;
    gameState.cursors = this.input.keyboard.createCursorKeys();

    gameState.bg = this.add.tileSprite(0, 0, 0, 0, 'bg').setOrigin(0, 0);
    gameState.bg2 = this.add.tileSprite(0, 0, 0, 0, 'bg2').setOrigin(0, 0);
    gameState.bg3 = this.add.tileSprite(0, 0, 0, 0, 'bg3').setOrigin(0, 0);
    this.createParallaxBackgrounds();

    gameState.player = this.physics.add.sprite(config.width / 2, 0, 'alien', 'idle/01').setScale(.8);
    gameState.player.setCollideWorldBounds(true);
    gameState.player.setSize(62, 105, true);
    gameState.player.setOffset(-10, 0);
    // attack
    const attackFrames = this.anims.generateFrameNames('alien', {
                        start: 1, end: 4, zeroPad: 2,
                        prefix: 'attack/'
                    });
    this.anims.create({ key: 'attack', frames: attackFrames, frameRate: 10, repeat: 5 });
    // attack option 2 --> 'draw' 'fire'
    const drawFrames = this.anims.generateFrameNames('alien', {
                        start: 1, end: 5, zeroPad: 2,
                        prefix: 'fire/'
                    });
    this.anims.create({ key: 'draw', frames: drawFrames, frameRate: 10, repeat: 0});

    const fireFrames = this.anims.generateFrameNames('alien', {
                        start: 6, end: 11, zeroPad: 2,
                        prefix: 'fire/'
                    });
    this.anims.create({ key: 'fire', frames: fireFrames, frameRate: 10, repeat: -1 });

    // walk
    const walkFrames = this.anims.generateFrameNames('alien', {
      start: 1, end: 6, zeroPad: 2, prefix: 'walk/'
    })
    this.anims.create({key: 'walk', frames: walkFrames, frameRate: 10, repeat: -1 })
    // jump
    const jumpFrames = this.anims.generateFrameNames('alien', {
      start: 1, end: 4, zeroPad: 2, prefix: 'jump/'
    })
    this.anims.create({key: 'jump', frames: jumpFrames, frameRate: 3 })

  }



  createParallaxBackgrounds() {
    // Add in the three background images here and set their origin

    gameState.bg.setDisplaySize(config.width, config.height);

    gameState.bg2.setOrigin(0, 0);
    gameState.bg3.setOrigin(0, 0);

    const game_width = parseFloat(gameState.bg3.getBounds().width)
    gameState.width = game_width;
    const window_width = config.width

    const bg1_width = gameState.bg.getBounds().width
    const bg2_width = gameState.bg2.getBounds().width
    const bg3_width = gameState.bg3.getBounds().width

    // Set the scroll factor for bg1, bg2, and bg3 here!
    gameState.bg.setScrollFactor((bg1_width - window_width) / (game_width - window_width));
    gameState.bg2.setScrollFactor((bg2_width - window_width)/(game_width - window_width));
  }

  update() {
    // gameState.bg.tilePositionX -= 0.05;
    gameState.bg2.tilePositionX += 5;
    gameState.bg3.tilePositionX += 10;
    gameState.player.x -= 2;

    if (gameState.active) {
      if (gameState.cursors.up.isDown) {
        // gameState.player.setVelocity(250);
        gameState.player.setVelocityY(-300);
        gameState.player.anims.play('jump', true);
      }
      else if (gameState.cursors.right.isDown) {
        gameState.player.setVelocityX(200);
        gameState.player.anims.play('walk', true);
      }
      else if (gameState.cursors.space.isDown) {
        gameState.player.x += 2;
        gameState.player.play('fire', true);
        // gameState.player.anims.play('attack', true);
      }
      else {
        gameState.player.setVelocityX(0);
        gameState.player.anims.play('walk', true)
      }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth - 15,
  height: window.innerHeight - 25,
  backgroundColor: "0x18235C",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000},
      enableBody: true,
      debug: true
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config);
