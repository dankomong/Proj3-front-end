class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.heights = [4, 7, 5, null, 5, 4, null, 4, 4]
    this.jump = 0;
  }

  preload() {
    this.load.image('bg', './assets/space1.png');
    this.load.image('bg2', './assets/bkgd_1.png');
    this.load.image('bg3', './assets/bkgd_4.png');

    this.load.image('bug1', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png');
		this.load.image('bug2', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_2.png');
		this.load.image('bug3', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_3.png');

    this.load.image('platform', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/Codey+Tundra/platform.png');

    this.load.image('face', './assets/alienface.png');

    // this.load.spritesheet('alien', './assets/alien.png', {frameWidth: 83, frameHeight: 116});

    this.load.spritesheet('bullet', './assets/rgblaser.png', {frameWidth: 4, frameHeight: 4});
    //this.load.spritesheet('enemy', 'http://www.feplanet.net/media/sprites/8/battle/sheets/enemy/monster_gorgon_magic.gif', 'assets');


    this.load.multiatlas('alien', './assets/alien.json', 'assets');

  }

  create() {
    gameState.active = true;

    gameState.cursors = this.input.keyboard.createCursorKeys();

    gameState.bg = this.add.tileSprite(0, 0, 0, 0, 'bg').setOrigin(0, 0);
    gameState.bg2 = this.add.tileSprite(0, 0, 0, 0, 'bg2').setOrigin(0, 0);
    gameState.bg3 = this.add.tileSprite(0, 0, 0, 0, 'bg3').setOrigin(0, -100);
    gameState.bg.setScale(1.25);

    gameState.player = this.physics.add.sprite(config.width / 4, 0, 'alien', 'idle/01').setScale(.8);

    // gameState.lives = 3;
    // let xCoord = 50;
    // for (let i = 0; i < gameState.lives; i++) {
    //     gameState.face = this.add.tileSprite(xCoord, 700, 0, 0, 'face')
    //     xCoord += 60;
    // }


    gameState.player.body.gravity.y = 800;

    //gameState.enemy = this.physics.add.sprite(config.width / 4, 0, 'alien', 'idle/01').setScale(.8);

    gameState.platform1 = this.physics.add.sprite(config.width / 3, 500, 'platform');
    gameState.platform2 = this.physics.add.sprite( ((2 * config.width) / 3) + 150, 400, 'platform');
    gameState.platform3 = this.physics.add.sprite(config.width + 300, 300, 'platform');
    gameState.platforms = [gameState.platform1, gameState.platform2, gameState.platform3]
    gameState.platforms.forEach(platform => {
      platform.body.allowGravity = false;
      platform.body.immovable = true;
      platform.setVelocityX(-100);

      this.physics.add.collider(gameState.player, platform);
    })

    let yCoord = 0;
    const platformGen = () => {
      yCoord = Math.random() * (window.innerHeight - 200) + 150;
      let randomPlatform = this.physics.add.sprite(gameState.bg.width + 300, yCoord, 'platform')
      randomPlatform.body.allowGravity = false;
      randomPlatform.body.immovable = true;
      randomPlatform.setVelocityX(-100);
      this.physics.add.collider(gameState.player, randomPlatform);
    }

    const platformGenLoop = this.time.addEvent({
      delay: 3000,
      callback: platformGen,
      callbackScope: this,
      loop: true,
    });

    this.createAnimations();


    gameState.player.setCollideWorldBounds(true);
    gameState.player.setSize(62, 105, true);
    gameState.player.setOffset(-10, 0);

    this.cameras.main.setBounds(0, 0, gameState.bg.width, gameState.bg.height);
    this.physics.world.setBounds(0, 0, gameState.width, gameState.bg3.height + gameState.player.height);


    //this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5)
    //this.cameras.main.startFollow(gameState.face1, true, 0.5, 0.5)

    // bugs

    const bugs = this.physics.add.group();

    const bugList = ['bug1', 'bug2', 'bug3']

    const bugGen = () => {
      const xCoord = Math.random() * window.innerWidth * 2
      let randomBug = bugList[Math.floor(Math.random() * 3)]
      bugs.create(xCoord, 10, randomBug).body.gravity.y = 800;
    }

    const bugGenLoop = this.time.addEvent({
      delay: 400,
      callback: bugGen,
      callbackScope: this,
      loop: true,
    });


    // this makes the platforms disappear instead of the bugs
    // this.physics.add.collider(bugs, gameState.platforms, function (bug) {
    //   bug.destroy()
    // })
    let xCoord = 50;
    for (let i = 0; i < gameState.lives; i++) {
        this.add.tileSprite(xCoord, 700, 0, 0, 'face')
        xCoord += 60;
    }

    this.physics.add.collider(gameState.player, bugs, () => {
      gameState.player.play('die', true);
      if (gameState.lives > 0) {
        gameState.lives -= 1
        let xCoord = 50;
        for (let i = 0; i < gameState.lives; i++) {
            this.add.tileSprite(xCoord, 700, 0, 0, 'face')
            xCoord += 60;
        }
        console.log(gameState.lives)
        this.scene.restart();
      }
      else  { //gameState.lives === 0)
        console.log('dead')
        gameState.active = false;
        bugGenLoop.destroy();
        platformGenLoop.destroy();
        this.physics.pause();
        this.add.text(config.width / 2, (config.height / 2) - 100, 'Game Over', { fontSize: '15px', fill: '#b37329' });
        this.add.text(config.width / 2, (config.height / 2) - 50, `Your score is ${gameState.score}`, { fontSize: '15px', fill: '#b37329' });
        this.add.text(config.width / 2, (config.height / 2), `Click to Restart`, { fontSize: '15px', fill: '#b37329' });
        postScoreToDatabase().then(
        fetch('http://localhost:3000/scores')
    			.then(res => res.json())
    			.then(scores => {console.log(scores);
    				for(let i = 0; i < scores.length; i++) {
    					this.add.text((config.width / 2) - 30, (config.height / 2) + 60 + (15*i), `${i+1}. ${scores[i].player.name}   ${scores[i].score}`)
    				}
    			}));

        this.input.on('pointerup', () => {
          gameState.score = 0;
          gameState.lives = 3;
          getPlayerName();
          this.scene.restart();
        })
      };
    });


    //  Limited to 20 objects in the pool, not allowed to grow beyond it
    // bullets = this.pool.createObjectPool(Bullet, 20);

    bullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 40,
        runChildUpdate: true
    });

    //  Create the objects in advance, so they're ready and waiting in the pool
    bullets.create(20);

    this.physics.add.overlap(bugs, bullets, function(bug) {
      bug.destroy();
      gameState.score += 20;
      console.log(gameState.score);
    })

    cursors = this.input.keyboard.createCursorKeys();

    //speed = Phaser.Math.GetSpeed(300, 1);


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
    this.anims.create({key: 'jump', frames: jumpFrames, frameRate: 10 })
    // die
    const deathFrames = this.anims.generateFrameNames('alien', {
      start: 1, end: 5, zeroPad: 2, prefix: 'dead/'
    })
    this.anims.create({key: 'die', frames: deathFrames, frameRate: 5})

  }


  update(time, delta) {

    gameState.bg2.tilePositionX += 6;
    gameState.bg3.tilePositionX += 11;

    if (gameState.active) {

      if (gameState.cursors.right.isDown) {
        //gameState.tracking = false;
        gameState.player.flipX = false;
        gameState.player.setVelocityX(300);
      }
      else if (gameState.cursors.left.isDown) {
        //gameState.tracking = true;
        gameState.player.flipX = true;
        gameState.player.setVelocityX(-200);
      }
      else {
        gameState.player.anims.play('walk', true)
        gameState.player.setVelocityX(0);
      }

      if (Phaser.Input.Keyboard.JustDown(gameState.cursors.up) && this.jump > 0) {
        this.jump--;
        // gameState.player.setVelocity(250);
        gameState.player.setVelocityY(-500);
        gameState.player.anims.play('jump', true);
      }


      if (gameState.player.body.touching.down){
        this.jump = 1;
        // gameState.player.anims.play('jump', true);
      };


      if (gameState.player.y > gameState.bg3.height - 1300) {
        gameState.player.anims.play('die', true);
        this.cameras.main.shake(240, .01, false, function(camera, progress) {
          if (progress > .9 && gameState.lives > 0) {
            this.scene.restart(this.levelKey);
            gameState.lives -= 1
            console.log(gameState.lives)
          }
          else  {
            gameState.active = false;
            this.physics.pause();
            this.add.text(config.width / 2, config.height / 2, 'Game Over', { fontSize: '15px', fill: '#b37329' });
            this.add.text(config.width / 2, config.height / 2 + 50, `Your score is ${gameState.score}`, { fontSize: '15px', fill: '#b37329' });
            this.add.text(config.width / 2, config.height / 2 + 150, `Click to Restart`, { fontSize: '15px', fill: '#b37329' });
            postScoreToDatabase();
            console.log('i fell!')

            this.input.on('pointerup', () => {
              gameState.score = 0;
              gameState.lives = 3;
              this.scene.restart();
              getPlayerName();
            })
          }
        });
      }

      // BUTTON FOR SHOOTING
      if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space) && time > lastFired) {

        // if (gameState.cursors.left.isDown) {
        //   console.log('player left', gameState.player)
        //   gameState.tracking = true;
        // }
        // else if (gameState.cursors.right.isDown) {
        //   console.log('player right', gameState.player)
        //   gameState.tracking = false;
        // }
        gameState.player.anims.play('fire', true);
          var bullet = bullets.get();
          bullet.setActive(true);
          bullet.setVisible(true);
          bullet.collideWorldBounds=false;

           if (bullet){
             //console.log('bullet', bullet)
              // let offset = new Phaser.Geom.Point(0, -gameState.player.height / 2 + 50);
              // Phaser.Math.Rotate(offset, gameState.player.angle);
              bullet.fire(gameState.player);
              lastFired = time + 50;
           }
       }

    }
  }
}
