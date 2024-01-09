import Phaser from 'phaser';

const Direction = {
	'UP': 'UP',
	'DOWN': 'DOWN',
	'RIGHT': 'RIGHT',
	'LEFT': 'LEFT'
}

const randomDirection = (exclude) => {
	const newDirectionIndex = Phaser.Math.Between(0, 3);
	let newDirection = Direction.UP;

	if (newDirectionIndex === 0) {
		newDirection = Direction.DOWN;
	} else if (newDirectionIndex === 1) {
		newDirection = Direction.RIGHT;
	} else if (newDirectionIndex === 2) {
		newDirection = Direction.LEFT;
	}

	if (newDirection === exclude) {
		return randomDirection(exclude);
	}

	return newDirection;
}

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture, frame);

		this.direction = Direction.RIGHT;
		this.speed = 50;
		this.anims.play('enemy-run');
		this.moveEvent = scene.time.addEvent({
			delay: 2000,
			callback: () => {
				this.direction = randomDirection(this.direction);
			},
			loop: true
		});

		scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this);
	}

	destroy(fromScene) {
		this.moveEvent.destroy();
		super.destroy(fromScene);
	}

	handleTileCollision(gameObject, tile) {
		if (gameObject !== this) {
			return;
		}

		this.direction = randomDirection(this.direction);
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);

		switch(this.direction) {
			case Direction.UP:
				this.setVelocity(0, -this.speed);
				break;

			case Direction.DOWN:
				this.setVelocity(0, this.speed);
				break;

			case Direction.RIGHT:
				this.setVelocity(this.speed, 0);
				this.scaleX = 1;
				this.body.offset.x = 0;
				break;

			case Direction.LEFT:
				this.setVelocity(-this.speed, 0);
				this.scaleX = -1;
				this.body.offset.x = 30;
				break;
		}
	}
}
