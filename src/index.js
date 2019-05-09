console.log('hello world')
// img = document.createElement('img')
// img.src = './assets/alien.png'
// document.querySelector('body').appendChild(img)

const gameState = {
  score: 0,
  lives: 3
};
let bullets;
let ship;
let speed;
let stats;
let cursors;
let lastFired = 0;

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


const config = {
  type: Phaser.AUTO,
  width: window.innerWidth - 15,
  height: window.innerHeight - 25,
  backgroundColor: "010408",
  physics: {
    default: 'arcade',
    arcade: {
      //debug: true,
      //gravity: { y: 800 },
      enableBody: true,
    }
  },
  scene: [StartScene, GameScene]
};

const game = new Phaser.Game(config);
