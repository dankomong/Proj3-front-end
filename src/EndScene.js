class EndScene extends Phaser.Scene {
  update() {
    this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Game Over', { fontSize: '15px', fill: '#ffffff' });
    this.add.text(window.innerWidth / 2, window.innerHeight / 2, `Your score is ${gameState.score}`, { fontSize: '15px', fill: '#ffffff' });
    this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 50, 'Click to Restart', { fontSize: '15px', fill: '#ffffff' });


  }

  getNameFromPlayer() {

  }


  // postScoreToDb() {
  //   fetch('http://localhost:3000/scores', {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //     headers:{
  //       'Content-Type': 'application/json'
  //     }
  //   })
  // }
}
