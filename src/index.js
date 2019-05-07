console.log('hello world')
// img = document.createElement('img')
// img.src = './assets/alien.png'
// document.querySelector('body').appendChild(img)

const gameState = {};

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.heights = [4, 7, 5, null, 5, 4, null, 4, 4]
  }

  preload() {
    this.load.image('bg', './assets/space1.png');
    // this.load.image('bg', './assets/bkgd_0.png');
    this.load.image('bg2', './assets/bkgd_1.png');
    this.load.image('bg3', './assets/bkgd_4.png');
    this.load.image('platform', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Codey+Tundra/platform.png');
    this.load.spritesheet('alien', './assets/alien.png', {frameWidth: 83, frameHeight: 116});
  }

  create() {
    gameState.active = true;
    gameState.platforms = this.physics.add.staticGroup();

    gameState.bg = this.add.tileSprite(0, 0, 0, 0, 'bg').setOrigin(0, 0);
    gameState.bg2 = this.add.tileSprite(0, 0, 0, 0, 'bg2').setOrigin(0, 0);
    gameState.bg3 = this.add.tileSprite(0, 0, 0, 0, 'bg3').setOrigin(0, 0);
    this.createParallaxBackgrounds();

    gameState.player = this.physics.add.sprite(50, 100, 'alien').setScale(.8);

    for (const [xIndex, yIndex] of this.heights.entries()) {
      this.createPlatform(xIndex, yIndex);
    }

    this.cameras.main.setBounds(0, 0, gameState.bg3.width, gameState.bg3.height);
    this.physics.world.setBounds(0, 0, gameState.width, gameState.bg3.height + gameState.player.height);


    this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5)

    this.physics.add.collider(gameState.player, gameState.platforms);

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

  createPlatform(xIndex, yIndex) {
  // Creates a platform evenly spaced along the two indices.
  // If either is not a number it won't make a platform
    if (typeof yIndex === 'number' && typeof xIndex === 'number') {
      gameState.platforms.create((250 * xIndex),  yIndex * 70, 'platform').setOrigin(0, 0.5).refreshBody();
    }
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
    gameState.bg2.setScrollFactor((bg2_width - window_width) /(game_width - window_width));
  }

  update() {
    // gameState.bg.tilePositionX -= 0.05;
    // gameState.bg2.tilePositionX += 5;
    // gameState.bg3.tilePositionX += 10;

    if (gameState.active) {
      if (gameState.cursors.space.isDown) {
        // gameState.player.anims.play('fire', true);
      }
      else if (gameState.cursors.right.isDown) {
        gameState.player.flipX = false;
        // gameState.player.anims.play('fire', true);
        gameState.player.setVelocityX(200);
      }
      else if (gameState.cursors.left.isDown) {
        gameState.player.flipX = true;
        // gameState.player.anims.play('fire', true);
        gameState.player.setVelocityX(-200);
      }
      else {
        gameState.player.anims.play('idle', true)
        gameState.player.setVelocityX(0);
      }

      if (Phaser.Input.Keyboard.JustDown(gameState.cursors.up) && gameState.player.body.touching.down) {
        // gameState.player.setVelocity(250);
        gameState.player.setVelocityY(-500);
        gameState.player.anims.play('float', true);
      }


      if (!gameState.player.body.touching.down){
        // gameState.player.anims.play('jump', true);
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
      debug: true,
      gravity: { y: 800 },
      enableBody: true,
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config);
