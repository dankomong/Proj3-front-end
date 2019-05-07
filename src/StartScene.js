class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: 'StartScene' })
	}

	create() {
		this.add.text( window.innerWidth / 2 - 80, window.innerHeight / 2, 'Click to start!', {fill: '#000000', fontSize: '20px'})
		this.input.on('pointerdown', () => {
			this.scene.stop('StarScene')
			this.scene.start('GameScene')
		})
	}
}
