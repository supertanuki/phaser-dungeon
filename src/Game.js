import Phaser from 'phaser'

export default class Game extends Phaser.Scene {	
	constructor() {
		super('game')
		this.controls = null;
		this.cursors = null;
		this.hero = null;
	}

	preload() {
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	create() {
		const map = this.make.tilemap({ key: 'dungeon' });
		const tileset = map.addTilesetImage('tiles', 'tiles');
		const dungeon = map.createLayer('Dungeon', tileset);
		dungeon.setCollisionByProperty({ collide: true });

		const camera = this.cameras.main;
		this.cursors = this.input.keyboard.createCursorKeys();
		this.hero = this.physics.add.sprite(50, 50, 'hero', 'run-down-1');
		this.hero.body.setSize(this.hero.width * 0.5, this.hero.height * 0.8);

		this.anims.create({
			key: 'hero-idle-down',
			frames: [{ key: 'hero', frame: 'run-down-2' }]
		});

		this.anims.create({
			key: 'hero-idle-up',
			frames: [{ key: 'hero', frame: 'run-up-4' }]
		});

		this.anims.create({
			key: 'hero-idle-side',
			frames: [{ key: 'hero', frame: 'run-side-2' }]
		});

		this.anims.create({
			key: 'hero-run-down',
			frames: this.anims.generateFrameNames('hero', { start: 1, end: 8, prefix: 'run-down-' }),
			repeat: -1,
			frameRate: 14
		});

		this.anims.create({
			key: 'hero-run-up',
			frames: this.anims.generateFrameNames('hero', { start: 1, end: 8, prefix: 'run-up-' }),
			repeat: -1,
			frameRate: 14
		});

		this.anims.create({
			key: 'hero-run-side',
			frames: this.anims.generateFrameNames('hero', { start: 1, end: 8, prefix: 'run-side-' }),
			repeat: -1,
			frameRate: 14
		});

		this.hero.anims.play('hero-idle-down');

		this.physics.add.collider(this.hero, dungeon);
		this.cameras.main.startFollow(this.hero, true);
	}

	update(time, delta) {
		if (!this.cursors || !this.hero) {
			return;
		}

		const speed = 100;

		this.hero.body.setVelocity(0);

		if (this.cursors.left.isDown) {
			this.hero.setVelocityX(-speed);
			this.hero.scaleX = -1;
			this.hero.body.offset.x = 24;

		} else if (this.cursors.right.isDown) {
			this.hero.setVelocityX(speed);
			this.hero.scaleX = 1;
			this.hero.body.offset.x = 8;
		}
		
		if (this.cursors.up.isDown) {
			this.hero.setVelocityY(-speed);
			//this.hero.body.offset.y = 8;

		} else if (this.cursors.down.isDown) {
			this.hero.setVelocityY(speed);
			//this.hero.body.offset.y = 4;
		}


		// Animation need to be done once
		if (this.cursors.up.isDown) {
			this.hero.anims.play('hero-run-up', true);

		} else if (this.cursors.down.isDown) {
			this.hero.anims.play('hero-run-down', true);

		} else if (this.cursors.left.isDown) {
			this.hero.anims.play('hero-run-side', true);

		} else if (this.cursors.right.isDown) {
			this.hero.anims.play('hero-run-side', true);
		}
			
		
		if (!this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
			const parts = this.hero.anims.currentAnim.key.split('-');
			parts[1] = 'idle';
			this.hero.anims.play(parts.join('-'));
			this.hero.setVelocity(0, 0);
		}
	}
}
