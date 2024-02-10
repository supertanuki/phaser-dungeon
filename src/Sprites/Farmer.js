import { Direction, randomDirection } from "../Utils/randomDirection";

class Farmer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    this.speed = 20;
    this.initialY = y;
    this.isMoving = true

    scene.anims.create({
      key: "farmer-walk-down",
      frames: scene.anims.generateFrameNames("farmer", {
        start: 1,
        end: 3,
        prefix: "walk-down-",
      }),
      repeat: -1,
      frameRate: 7,
    });

    scene.anims.create({
      key: "farmer-walk-up",
      frames: scene.anims.generateFrameNames("farmer", {
        start: 1,
        end: 3,
        prefix: "walk-up-",
      }),
      repeat: -1,
      frameRate: 7,
    });

    scene.anims.create({
      key: "farmer-walk-side",
      frames: scene.anims.generateFrameNames("farmer", {
        start: 1,
        end: 3,
        prefix: "walk-left-",
      }),
      repeat: -1,
      frameRate: 7,
    });

    scene.anims.create({
      key: "farmer-idle",
      frames: [{ key: "farmer", frame: "walk-down-2" }],
    });

    scene.physics.add.collider(this, scene.dungeon, () => {
      this.direction = randomDirection(this.direction);
    });

    this.direction = Direction.RIGHT;

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true,
    });
  }

  move() {
    this.isMoving = true
  }

  stopMoving() {
    this.isMoving = false
    this.play("farmer-idle");
    this.setVelocity(0);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.isMoving) {
      return
    }

    switch (this.direction) {
      case Direction.UP:
        this.play("farmer-walk-up", true);
        this.setVelocity(0, -this.speed);
        this.scaleX = 1;
        this.body.offset.x = 0;
        break;

      case Direction.DOWN:
        this.play("farmer-walk-down", true);
        this.setVelocity(0, this.speed);
        this.scaleX = 1;
        this.body.offset.x = 0;
        break;

      case Direction.RIGHT:
        this.play("farmer-walk-side", true);
        this.setVelocity(this.speed, 0);
        this.scaleX = -1;
        this.body.offset.x = 16;
        break;

      case Direction.LEFT:
        this.play("farmer-walk-side", true);
        this.setVelocity(-this.speed, 0);
        this.scaleX = 1;
        this.body.offset.x = 0;
        break;

      default:
        this.play("farmer-idle");
        this.setVelocity(0, 0);
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "farmer",
  function (x, y, texture, frame) {
    const sprite = new Farmer(this.scene, x, y, texture, frame);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    return sprite;
  }
);
