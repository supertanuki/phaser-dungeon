import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
	constructor() {
		super('preloader')
	}

	preload() {
		this.load.image('tiles', 'img/Environment/PNG/tiles.png');
		this.load.tilemapTiledJSON('dungeon', 'tiles/tiles.json');

		this.load.atlas('hero', 'sprites/hero.png', 'sprites/hero.json');
		this.load.atlas('enemy', 'sprites/enemy.png', 'sprites/enemy.json');
	}

	create() {
		this.scene.start('game');
	}
}
