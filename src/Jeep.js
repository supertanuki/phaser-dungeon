import Phaser from 'phaser';
import { sceneEvents, sceneEventsEmitter } from './Events/EventsCenter';

const Direction = {
	'UP': 'UP',
	'DOWN': 'DOWN',
	'RIGHT': 'RIGHT',
	'LEFT': 'LEFT'
}

const randomDirection = (exclude) => {
	const newDirectionIndex = Phaser.Math.Between(0, 3);
	let newDirection = null;

	if (newDirectionIndex === 0) {
		newDirection = Direction.UP;
	} else if (newDirectionIndex === 1) {
		newDirection = Direction.DOWN;
	} else if (newDirectionIndex === 2) {
		newDirection = Direction.LEFT;
	} else if (newDirectionIndex === 3) {
		newDirection = Direction.RIGHT;
	}

	if (newDirection === exclude) {
		return randomDirection(exclude);
	}

	return newDirection;
}

export default class Jeep extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture, frame);

		this.scene = scene
		this.direction = Direction.DOWN;
		this.speed = 50;
		this.setTexture('jeep', 'jeep-left')
        this.scale = 0.5

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
                this.setTexture('jeep', 'jeep-up')
                this.body.setSize(this.width, this.height);
				this.setVelocity(0, -this.speed);
                this.body.offset.x = 0;
                this.scaleX = 0.5;
				break;

			case Direction.DOWN:
                this.setTexture('jeep', 'jeep-down')
                this.body.setSize(this.width, this.height);
				this.setVelocity(0, this.speed);
                this.body.offset.x = 0;
                this.scaleX = 0.5;
				break;

			case Direction.RIGHT:
                this.setTexture('jeep', 'jeep-left')
                this.body.setSize(this.width, this.height);
				this.setVelocity(this.speed, 0);
				this.scaleX = 0.5;
				this.body.offset.x = 0;
				break;

			case Direction.LEFT:
                this.setTexture('jeep', 'jeep-left')
                this.body.setSize(this.width, this.height);
				this.setVelocity(-this.speed, 0);
				this.scaleX = -0.5;
				this.body.offset.x = 160;
				break;

			default:
				this.setVelocity(0, 0);
		}
	}
}
