import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
	constructor() {
		super('preloader')
	}

	preload() {
		this.load.image('tiles', 'src/assets/img/Environment/PNG/tiles.png');
		this.load.tilemapTiledJSON('dungeon', 'src/tiles/tiles.json');

		this.load.atlas('hero', 'src/sprites/hero.png', 'src/sprites/hero.json');
		this.load.atlas('enemy', 'src/sprites/enemy.png', 'src/sprites/enemy.json');
	}

	create() {
		this.scene.start('game');
	}
}
