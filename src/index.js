console.log('hello world')
// img = document.createElement('img')
// img.src = './assets/alien.png'
// document.querySelector('body').appendChild(img)

const gameState = {
  lives: 3
};

function getPlayerName() {
  gameState.playerName = prompt("Please enter your name:", "");
  fetch('http://localhost:3000/players', {
      method: 'POST',
      body: JSON.stringify({name: gameState.playerName}),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(player => {
      gameState.playerId = player.id;
    })
}

getPlayerName();

function postScoreToDatabase() {
  return fetch('http://localhost:3000/scores', {
      method: 'POST',
      body: JSON.stringify({
        score: gameState.score,
        player_id: gameState.playerId
      }),
      headers:{
        'Content-Type': 'application/json'
      }
    })
}

let bullets;
let ship;
let speed;
let stats;
let cursors;
let lastFired = 0;

var Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Sprite,

    initialize:

    function Bullet (scene)
    {
        Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'bullet');

        this.speed = 0;
        //console.log('this', this)
        // Use velocity for movement
        // Note that `velocity` is a built-in property
        //   if you are using any of the physics engines
        //   of Phaser
        // this.velocity = new Phaser.Geom.Point(0, 0);

    },

    fire: function (player)
    {
        //this.setPosition(x, y + 5)
        // this.setActive(true);
        // this.setVisible(true);

        this.setPosition(player.x, player.y);
            console.log("playerflip", player.flipX)
            if (player.flipX)
            {
                //  Facing left
                this.speed = Phaser.Math.GetSpeed(-500, 1);
            }
            else
            {
                //  Facing right
                this.speed = Phaser.Math.GetSpeed(500, 1);
            }

        // this.velocity.setTo(0, -this.speed)
        // Phaser.Math.Rotate(this.velocity, direction)
    },

    update: function (time, delta)
    {
        this.x += this.speed * delta;

        if (this.x > 1820)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});


const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "010408",
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      //gravity: { y: 800 },
      enableBody: true,
    }
  },
  scene: [StartScene, GameScene]
};

const game = new Phaser.Game(config);
