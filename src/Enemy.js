import Phaser from 'phaser';

const Direction = {
	'UP': 'UP',
	'DOWN': 'DOWN',
	'RIGHT': 'RIGHT',
	'LEFT': 'LEFT'
}

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture, frame);

		this.direction = Direction.RIGHT;
		this.speed = 50;
		this.anims.play('enemy-run');

		scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this);
	}

	handleTileCollision(gameObject, tile) {
		if (gameObject !== this) {
			return;
		}

		if (this.direction === Direction.LEFT) {
			this.direction = Direction.RIGHT;
		} else {
			this.direction = Direction.LEFT;
		}
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
