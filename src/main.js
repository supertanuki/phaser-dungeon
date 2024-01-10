import Phaser from 'phaser'

import Preloader from './Preloader'
import Game from './Game'

const config = {
	type: Phaser.AUTO,
	parent: 'game',
	width: 550,
	height: 300,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true,
			gravity: { y: 0 },
		},
	},
	scene: [Preloader, Game],
	scale: {
		zoom: 2,
		mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
	}
}

export default new Phaser.Game(config)
