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
		this.joystick = null;
		this.speed = 100;

		this.goingLeft = false;
		this.goingRight = false;
		this.goingDown = false;
		this.goingUp = false;
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

		//this.cursors = this.input.keyboard.createCursorKeys();
		this.cursors = this.input.keyboard.addKeys({
			up: 'up',
			down: 'down',
			left: 'left',
			right: 'right'
		});

		this.input.keyboard.on('keydown', function (event) {
			console.log(event)

			if (event.key === 'ArrowUp') {
				this.goingUp = true
				this.goingDown = false

			} else if (event.key === 'ArrowDown') {
				this.goingDown = true
				this.goingUp = false

			} else if (event.key === 'ArrowLeft') {
				this.goingLeft = true
				this.goingRight = false

			} else if (event.key === 'ArrowRight') {
				this.goingRight = true
				this.goingLeft = false
			}
		}, this)

		this.input.keyboard.on('keyup', function (event) {
			console.log(event)

			if (event.key === 'ArrowUp') {
				this.goingUp = false;
			} else if (event.key === 'ArrowDown') {
				this.goingDown = false;
			} else if (event.key === 'ArrowLeft') {
				this.goingLeft = false;
			} else if (event.key === 'ArrowRight') {
				this.goingRight = false;
			}
		}, this)

		this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
			x: 100,
			y: 200,
			radius: 100,
			base: this.add.circle(0, 0, 50, 0x8888ff, 0.6),
			thumb: this.add.circle(0, 0, 30, 0xcccccc, 0.6),
			dir: '8dir',
			forceMin: 16,
			enable: true
		});

		this.joystick.on('update', function () {
			//console.log('joystick rotation : ' + this.joystick.rotation)

			if (this.joystick.left) {
				this.goingLeft = true
				this.goingRight = false

			} else if (this.joystick.right) {
				this.goingRight = true
				this.goingLeft = false
			}

			if (this.joystick.up) {
				this.goingUp = true
				this.goingDown = false

			} else if (this.joystick.down) {
				this.goingDown = true
				this.goingUp = false
			}
		}, this);

		this.joystick.on('pointerup', function () {
			this.stopHero()
		}, this);

		this.hero = this.physics.add.sprite(50, 50, 'hero', 'run-down-1');
		this.hero.body.setSize(this.hero.width * 0.5, this.hero.height * 0.8);

		this.hero.anims.play('hero-idle-down')

		this.physics.add.collider(this.hero, dungeon);
		this.cameras.main.startFollow(this.hero, true);

		const enemies = this.physics.add.group({
			classType: Enemy,
			createCallback: (gameObject) => { gameObject.body.onCollide = true; }
		});
		enemies.get(150, 70, 'enemy');
		this.physics.add.collider(enemies, dungeon);

		this.physics.add.collider(enemies, this.hero, this.handleHeroEnemyCollision, undefined, this);
	}

	handleHeroEnemyCollision(hero, enemy) {
		enemy.destroy();
	}

	goLeft() {
		this.hero.setVelocityX(-this.speed);
		this.hero.scaleX = -1;
		this.hero.body.offset.x = 24;
	}

	goRight() {
		this.hero.setVelocityX(this.speed);
		this.hero.scaleX = 1;
		this.hero.body.offset.x = 8;
	}

	goUp() {
		this.hero.setVelocityY(-this.speed);
		//this.hero.body.offset.y = 8;
	}

	goDown() {
		this.hero.setVelocityY(this.speed);
		//this.hero.body.offset.y = 4;
	}

	animateToLeft() {
		this.hero.anims.play('hero-run-side', true);
	}

	animateToRight() {
		this.hero.anims.play('hero-run-side', true);
	}

	animateToUp() {
		this.hero.anims.play('hero-run-up', true);
	}

	animateToDown() {
		this.hero.anims.play('hero-run-down', true);
	}

	stopHero() {
		this.goingLeft = false;
		this.goingRight = false;
		this.goingDown = false;
		this.goingUp = false;

		const parts = this.hero.anims.currentAnim.key.split('-');
		parts[1] = 'idle';
		this.hero.anims.play(parts.join('-'));
		this.hero.setVelocity(0, 0);
	}

	update(time, delta) {
		if (!this.cursors || !this.hero) {
			return;
		}

		console.log(this.goingLeft, this.goingRight, this.goingUp, this.goingDown)

		this.hero.body.setVelocity(0);

		if (this.goingLeft) {
			this.goLeft()

		} else if (this.goingRight) {
			this.goRight()
		}


		if (this.goingUp) {
			this.goUp()

		} else if (this.goingDown) {
			this.goDown()
		}


		// Animation need to be done once
		if (this.goingUp) {
			this.animateToUp()

		} else if (this.goingDown) {
			this.animateToDown()

		} else if (this.goingLeft) {
			this.animateToLeft()

		} else if (this.goingRight) {
			this.animateToRight()
		}

		if (!this.goingDown && !this.goingUp && !this.goingRight && !this.goingLeft) {
			this.stopHero()
		}
	}
}
