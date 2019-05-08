console.log('hello world')
// img = document.createElement('img')
// img.src = './assets/alien.png'
// document.querySelector('body').appendChild(img)

const gameState = {};
let bullets;
let ship;
let speed;
let stats;
let cursors;
let lastFired = 0;

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

    //this.load.image('bullet', 'assets/sprites/purple_ball.png')

    this.load.image('bug1', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png');
		this.load.image('bug2', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_2.png');
		this.load.image('bug3', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_3.png');

    this.load.image('platform', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Codey+Tundra/platform.png');
    // this.load.spritesheet('alien', './assets/alien.png', {frameWidth: 83, frameHeight: 116});
    this.load.spritesheet('bullet', './assets/rgblaser.png', {frameWidth: 4, frameHeight: 4});
    this.load.multiatlas('alien', './assets/alien.json', 'assets');
  }

  create() {
    gameState.active = true;
    gameState.platforms = this.physics.add.staticGroup();
    gameState.cursors = this.input.keyboard.createCursorKeys();

    gameState.bg = this.add.tileSprite(0, 0, 0, 0, 'bg').setOrigin(0, 0);
    gameState.bg2 = this.add.tileSprite(0, 0, 0, 0, 'bg2').setOrigin(0, 0);
    gameState.bg3 = this.add.tileSprite(0, 0, 0, 0, 'bg3').setOrigin(0, 0);
    this.createParallaxBackgrounds();
    this.createAnimations();

    gameState.player = this.physics.add.sprite(config.width / 2, 0, 'alien', 'idle/01').setScale(.8);
    gameState.player.setCollideWorldBounds(true);
    gameState.player.setSize(62, 105, true);
    gameState.player.setOffset(-10, 0);

    for (const [xIndex, yIndex] of this.heights.entries()) {
      this.createPlatform(xIndex, yIndex);
    }

    this.cameras.main.setBounds(0, 0, gameState.bg3.width, gameState.bg3.height);
    this.physics.world.setBounds(0, 0, gameState.width, gameState.bg3.height + gameState.player.height);


    this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5)

    this.physics.add.collider(gameState.player, gameState.platforms);


    // bugs

    const bugs = this.physics.add.group();

    const bugList = ['bug1', 'bug2', 'bug3']

    const bugGen = () => {
      const xCoord = Math.random() * window.innerWidth * 2
      let randomBug = bugList[Math.floor(Math.random() * 3)]
      bugs.create(xCoord, 10, randomBug)
    }

    const bugGenLoop = this.time.addEvent({
      delay: 400,
      callback: bugGen,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.collider(bugs, gameState.platforms, function (bug) {
      bug.destroy()
    })

    this.physics.add.collider(gameState.player, bugs, () => {
      bugGenLoop.destroy();
      this.physics.pause();
      this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Game Over', { fontSize: '15px', fill: '#ffffff' });
      this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 50, 'Click to Restart', { fontSize: '15px', fill: '#ffffff' });

      this.input.on('pointerup', () => {
        gameState.score = 0;
        this.scene.restart();
      });
    });


    // gameState.player.frame = 5

    var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

            this.speed = Phaser.Math.GetSpeed(400, 1);

        },

        fire: function (x, y)
        {
            this.setPosition(x, y + 5)
            this.setActive(true);
            this.setVisible(true);
        },

        update: function (time, delta)
        {
            this.x += this.speed * delta;

            if (this.x > 820)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }

    });

    //  Limited to 20 objects in the pool, not allowed to grow beyond it
    // bullets = this.pool.createObjectPool(Bullet, 20);

    bullets = this.add.group({
        classType: Bullet,
        maxSize: 30,
        runChildUpdate: true
    });

    //  Create the objects in advance, so they're ready and waiting in the pool
    bullets.create(20);

    cursors = this.input.keyboard.createCursorKeys();

    speed = Phaser.Math.GetSpeed(300, 1);
  }

  createPlatform(xIndex, yIndex) {
    // Creates a platform evenly spaced along the two indices.
    // If either is not a number it won't make a platform
    if (typeof yIndex === 'number' && typeof xIndex === 'number') {
      gameState.platforms.create((250 * xIndex),  yIndex * 70, 'platform').setOrigin(0, 0.5).refreshBody();
    }
  }

  createAnimations() {

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
    gameState.bg2.setScrollFactor((bg2_width - window_width) /(game_width - window_width));
  }

  update(time, delta) {
    // gameState.bg.tilePositionX -= 0.05;
    gameState.bg2.tilePositionX += 5;
    gameState.bg3.tilePositionX += 10;
    // if (game.input.activePointer.isDown) {
    //     fire();
    //  }

    if (gameState.active) {
      gameState.player.anims.play('walk', true);
      if (gameState.cursors.right.isDown) {
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
        gameState.player.anims.play('walk', true)
        gameState.player.setVelocityX(0);
      }

      if (Phaser.Input.Keyboard.JustDown(gameState.cursors.up) && gameState.player.body.touching.down) {
        // gameState.player.setVelocity(250);
        gameState.player.setVelocityY(-500);
        gameState.player.anims.play('jump', true);
      }


      if (!gameState.player.body.touching.down){
        // gameState.player.anims.play('jump', true);
      }

      if (gameState.player.y > gameState.bg3.height - 150) {
        this.cameras.main.shake(240, .01, false, function(camera, progress) {
          if (progress > .9) {
            this.scene.restart(this.levelKey);
          }
        });
      }

      // BUTTON FOR SHOOTING
      if (gameState.cursors.space.isDown && time > lastFired) {
           var bullet = bullets.get();

           if (bullet){
               bullet.fire(gameState.player.x, gameState.player.y);
               lastFired = time + 50;
           }
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
      //debug: true,
      gravity: { y: 800 },
      enableBody: true,
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config);
