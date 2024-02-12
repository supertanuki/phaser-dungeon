import isMobile from "../Utils/isMobile";
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

    this.direction = Direction.RIGHT;

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = randomDirection(this.direction);
      },
      loop: true,
    });

    this.chatImageUi = scene.add.image(0, 0, 'ui-chat');
    this.chatImageUi.setVisible(false)
    this.chatImageUi.setDepth(1000)

    this.chatTextUi = scene.add.text(0, 2, isMobile() ? 'Appuyer pour continuer': 'Appuyer sur espace', {
			font: '12px Arial',
			color: '#fff',
      backgroundColor: '#000',
      padding: 2
		})
    this.chatTextUi.setVisible(false)
    this.chatTextUi.setDepth(1000)
  }

  changeDirection() {
    this.setImmobile()
    this.direction = randomDirection(this.direction);
  }

  move() {
    this.isMoving = true
  }

  stopChatting() {
    this.chatImageUi.setVisible(false)
    this.chatTextUi.setVisible(false)
  }

  readyToChat() {
    this.stopMoving()
    this.chatImageUi.x = this.x
    this.chatImageUi.y = this.y - 20
    this.chatImageUi.setVisible(true)

    this.chatTextUi.x = this.x - 50
    this.chatTextUi.y = this.y - 48
    this.chatTextUi.setVisible(true)
  }

  stopMoving() {
    this.isMoving = false
    this.setImmobile()
  }

  setImmobile() {
    this.play("farmer-idle");
    this.setVelocity(0, 0);
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
        this.setImmobile()
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
