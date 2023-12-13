import Phaser from 'phaser'

import Preloader from './Preloader'
import Game from './Game'

const config = {
	type: Phaser.AUTO,
	parent: 'game',
	width: 400,
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
		zoom: 2
	}
}

export default new Phaser.Game(config)
