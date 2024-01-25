import Phaser from 'phaser';
import { sceneEvents, sceneEventsEmitter } from './Events/EventsCenter';

const Direction = {
	'UP': 'UP',
	'DOWN': 'DOWN',
	'RIGHT': 'RIGHT',
	'LEFT': 'LEFT'
}

const randomDirection = (exclude) => {
	const newDirectionIndex = Phaser.Math.Between(0, 4);
	let newDirection = null;

	if (newDirectionIndex === 0) {
		newDirection = Direction.DOWN;
	} else if (newDirectionIndex === 1) {
		newDirection = Direction.RIGHT;
	} else if (newDirectionIndex === 2) {
		newDirection = Direction.LEFT;
	} else if (newDirectionIndex === 3) {
		newDirection = Direction.UP;
	}

	if (newDirection === exclude) {
		return randomDirection(exclude);
	}

	return newDirection;
}

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture, frame);

		this.scene = scene
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

		sceneEventsEmitter.on(sceneEvents.GAMEOVER, this.gameOver, this)

		scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleTileCollision, this);
	}

	gameOver() {
		this.direction = null;
		this.moveEvent.destroy()
		//this.destroy(this.scene)
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

			default:
				this.setVelocity(0, 0);
		}
	}
}
