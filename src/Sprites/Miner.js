import { sceneEvents, sceneEventsEmitter } from "../Events/EventsCenter";
import isMobile from "../Utils/isMobile";

class Miner extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.futureMinerPosition = null
    this.initialY = y;

    scene.anims.create({
      key: "farmer-idle",
      frames: [{ key: "farmer", frame: "walk-down-2" }],
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
    this.setImmobile()

    sceneEventsEmitter.on(
      sceneEvents.EventsUnlocked,
      this.listenEvents,
      this
    );
  }

  listenEvents(data) {
    console.log('listenEvents', data)
    if (data.newUnlockedEvents.includes('miner_clothes_validated')) {
      this.moveMinerToNewPosition()
    }
  }

  moveMinerToNewPosition() {
    console.log('moveMinerToNewPosition', this.futureMinerPosition)
    const {x, y} = this.futureMinerPosition
    this.setPosition(x, y)
  }

  move() {
    // nothing
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
    this.setImmobile()
  }

  setImmobile() {
    this.play("farmer-idle");
  }

  addFuturePosition(futureMinerPosition) {
    this.futureMinerPosition = futureMinerPosition
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "miner",
  function (x, y, texture, frame) {
    const sprite = new Miner(this.scene, x, y, texture, frame);

    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    );

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    return sprite;
  }
);
