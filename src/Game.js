import Phaser from 'phaser';
import { createEnemyAnims } from './EnemyAnims';
import { createHeroAnims } from './HeroAnims';
import Enemy from './Enemy';

export default class Game extends Phaser.Scene {	
	constructor() {
		super('game')
		this.controls = null;
		this.cursors = null;
		this.hero = null;
		this.enemy = null;
	}

	preload() {
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	create() {
		createEnemyAnims(this.anims);
		createHeroAnims(this.anims);

		const map = this.make.tilemap({ key: 'dungeon' });
		const tileset = map.addTilesetImage('tiles', 'tiles');
		const dungeon = map.createLayer('Dungeon', tileset);
		dungeon.setCollisionByProperty({ collide: true });

		const camera = this.cameras.main;
		this.cursors = this.input.keyboard.createCursorKeys();
		this.hero = this.physics.add.sprite(50, 50, 'hero', 'run-down-1');
		this.hero.body.setSize(this.hero.width * 0.5, this.hero.height * 0.8);

		this.hero.anims.play('hero-idle-down');

		this.physics.add.collider(this.hero, dungeon);
		this.cameras.main.startFollow(this.hero, true);

		//this.enemy = this.physics.add.sprite(180, 90, 'enemy', 'big_demon_run_anim_f0');
		//this.enemy.anims.play('enemy-run');

		const enemies = this.physics.add.group({
			classType: Enemy,
			createCallback: (gameObject) => { gameObject.body.onCollide = true; }
		});
		enemies.get(150, 70, 'enemy');
		this.physics.add.collider(enemies, dungeon);
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
