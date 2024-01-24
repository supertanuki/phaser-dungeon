import Phaser from 'phaser';
import { createEnemyAnims } from './EnemyAnims';
import { createHeroAnims } from './HeroAnims';
import Enemy from './Enemy';

function isMobile() {
	const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
	return regex.test(navigator.userAgent);
}

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
		this.goingAngle = null;
		this.dungeon = null;
		this.hit = 0;
		
		this.heroHealth = 5;
	}

	preload() {
		this.cursors = this.input.keyboard.createCursorKeys();
	}

	create() {
		createEnemyAnims(this.anims);
		createHeroAnims(this.anims);

		const map = this.make.tilemap({ key: 'dungeon' });
		const tileset = map.addTilesetImage('tiles', 'tiles');
		this.dungeon = map.createLayer('Dungeon', tileset);
		this.dungeon.setCollisionByProperty({ collide: true });

		const camera = this.cameras.main;

		//this.cursors = this.input.keyboard.createCursorKeys();
		this.cursors = this.input.keyboard.addKeys({
			up: 'up',
			down: 'down',
			left: 'left',
			right: 'right'
		});

		this.input.keyboard.on('keydown', function (event) {
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

		this.hero = this.physics.add.sprite(50, 50, 'hero', 'run-down-1');
		this.hero.body.setSize(this.hero.width * 0.5, this.hero.height * 0.8);
		this.hero.anims.play('hero-idle-down')

		this.physics.add.collider(this.hero, this.dungeon);
		this.cameras.main.startFollow(this.hero, true);


		this.addEnemy(450, 70);
		this.addEnemy(50, 340);
		this.addEnemy(550, 320);
		this.addEnemy(750, 50);

		this.addJoystickForMobile();
	}

	addEnemy(x, y) {
		const enemies = this.physics.add.group({
			classType: Enemy,
			createCallback: (gameObject) => { gameObject.body.onCollide = true; }
		});
		enemies.get(x, y, 'enemy');

		this.physics.add.collider(enemies, this.dungeon);
		this.physics.add.collider(enemies, this.hero, this.handleHeroEnemyCollision, undefined, this);
	}

	addJoystickForMobile() {
		if (!isMobile()) {
			return;
		}

		this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
			x: 100,
			y: 200,
			radius: 100,
			base: this.add.circle(0, 0, 50, 0xff5544, 0.4),
			thumb: this.add.circle(0, 0, 30, 0xcccccc, 0.3),
			dir: '8dir',
			forceMin: 16,
			enable: true,
			inputEnable: true,
			fixed: true,
		});

		// Make floating joystick
		this.input.on('pointerdown', function(pointer) {
			this.joystick.setPosition(pointer.x, pointer.y);
			this.joystick.setVisible(true);
		}, this);

		this.joystick.on('update', function () {
			this.goingAngle = this.joystick.angle;

			if (this.joystick.left) {
				this.goingLeft = true
				this.goingRight = false

				if (177.5 < this.goingAngle || -177.5 > this.goingAngle) {
					this.goingUp = false
					this.goingDown = false
				}

			} else if (this.joystick.right) {
				this.goingRight = true
				this.goingLeft = false

				if (22.5 > this.goingAngle && -22.5 < this.goingAngle) {
					this.goingUp = false
					this.goingDown = false
				}
			}

			if (this.joystick.up) {
				this.goingUp = true
				this.goingDown = false

				if (-67.5 > this.goingAngle && -112.5 < this.goingAngle) {
					this.goingRight = false
					this.goingLeft = false
				}

			} else if (this.joystick.down) {
				this.goingDown = true
				this.goingUp = false

				if (67.5 < this.goingAngle && 112.5 > this.goingAngle) {
					this.goingRight = false
					this.goingLeft = false
				}
			}
		}, this);

		this.joystick.on('pointerup', function () {
			this.joystick.setVisible(false);
			this.stopHero()
		}, this);
	}

	handleHeroEnemyCollision(hero, enemy) {
		//enemy.destroy();

		const dx = this.hero.x - enemy.x
		const dy = this.hero.y - enemy.y

		const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

		this.hero.setVelocity(dir.x, dir.y)

		this.hit = 1

		--this.heroHealth
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

	handleHit() {
		++this.hit
		this.hero.setTint(0xff0000)

		this.cameras.main.zoom = this.hit % 3 ? 1.05 : 1

		if (this.hit > 10) {
			this.hit = 0
			this.cameras.main.zoom = 1
			this.hero.setTint(0xffffff)
		}
	}

	update(time, delta) {
		if (this.hit > 0) {
			this.handleHit()
			return
		}

		if (!this.cursors || !this.hero) {
			return
		}

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
		if (this.goingUp && (null === this.goingAngle || -45 > this.goingAngle && -135 <= this.goingAngle)) {
			this.animateToUp()

		} else if (this.goingDown && (null === this.goingAngle || 45 < this.goingAngle && 135 >= this.goingAngle)) {
			this.animateToDown()

		} else if (this.goingRight && (null === this.goingAngle || 45 > this.goingAngle && -45 <= this.goingAngle)) {
			this.animateToRight()

		} else if (this.goingLeft) {
			this.animateToLeft()
		}

		if (!this.goingDown && !this.goingUp && !this.goingRight && !this.goingLeft) {
			this.stopHero()
		}
	}
}
