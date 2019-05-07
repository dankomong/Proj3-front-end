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
    this.load.spritesheet('alien', './assets/alien.png', {frameWidth: 83, frameHeight: 116});
  }

  create() {
    gameState.active = true;
    gameState.bg = this.add.tileSprite(0, 0, 0, 0, 'bg').setOrigin(0, 0);
    gameState.bg2 = this.add.tileSprite(0, 0, 0, 0, 'bg2').setOrigin(0, 0);
    gameState.bg3 = this.add.tileSprite(0, 0, 0, 0, 'bg3').setOrigin(0, 0);
    this.createParallaxBackgrounds();

    gameState.player = this.physics.add.sprite(config.width / 2, 400, 'alien').setScale(.8);
    this.anims.create({
      key: 'float',
      frames: this.anims.generateFrameNumbers('alien', { start: 9, end: 14 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('alien', { start: 3, end: 5 }),
      frameRate: 5,
      repeat: -1
    });

    // this.anims.create({
    //   key: 'fire',
    //   frames: this.anims.generateFrameNumbers('alien', { start: 5, end: 6 }),
    //   frameRate: 5,
    //   repeat: -1
    // });

    gameState.player.anims.play('idle', true);
    gameState.player.setCollideWorldBounds(true);
    gameState.cursors = this.input.keyboard.createCursorKeys();
    // gameState.player.frame = 5

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

    if (gameState.active) {
      if (gameState.cursors.up.isDown) {
        // gameState.player.setVelocity(250);
        gameState.player.setVelocityY(-100);
        gameState.player.anims.play('float', true);
      }
      else if (gameState.cursors.space.isDown) {
        // gameState.player.anims.play('fire', true);
      }
      else {
        gameState.player.anims.play('idle', true)
      }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth - 50,
  height: window.innerHeight - 25,
  backgroundColor: "0x18235C",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      enableBody: true,
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config);
