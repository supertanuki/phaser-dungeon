import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
	constructor() {
		super('preloader')
		this.progressBar = null;
	}

	preload() {
		const screenWidth = this.cameras.main.width;
		const screenHeight = this.cameras.main.height;

		this.progressBar = this.add.graphics();

		this.load.on('progress', function (value) {
			this.progressBar.clear();
			this.progressBar.fillStyle(0xffffff, 1);
			this.progressBar.fillRect(0, screenHeight/2, screenWidth * value, 30);
		}, this);

		this.load.on('complete', function () {
			this.progressBar.destroy();
		}, this);

		this.load.image('tiles', 'img/Environment/PNG/tiles.png');
		this.load.tilemapTiledJSON('dungeon', 'tiles/tiles.json');

		this.load.plugin('rexvirtualjoystickplugin', 'plugins/rexvirtualjoystickplugin.min.js', true);

		this.load.atlas('hero', 'sprites/hero.png', 'sprites/hero.json');
		this.load.atlas('enemy', 'sprites/enemy.png', 'sprites/enemy.json');
	}

	create() {
		this.scene.start('game');
	}
}
