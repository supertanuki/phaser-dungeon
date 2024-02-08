import Phaser from "phaser";
import { sceneEvents, sceneEventsEmitter } from "./Events/EventsCenter";

export default class Message extends Phaser.Scene {
  constructor() {
    super("message");
    this.textObject = null
    this.currentText = ''
  }

  create() {
    const config = this.sys.game.config;
    this.textObject = this.add.text(config.width / 2, config.height - 20, "", {
      font: "14px",
      fill: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: 6,
      alpha: 0,
    })
    this.textObject
      .setShadow(0, 0, "rgba(0,0,0,1)", 3)
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(1000)
      .setWordWrapWidth(300)
      .setActive(false)
      .setVisible(false)

    sceneEventsEmitter.on(sceneEvents.MESSAGESSENT, this.handleMessage, this)
  }

  handleMessage(text) {
    if (this.textObject.visible && text === this.currentText) {
        return
    }

    this.currentText = text
    this.textObject.setVisible(true)
    
    /*
    this.tweens.add({
      targets: this.textObject,
      alpha: { value: 1, ease: "linear" },
      duration: 300,
    });
    */

    this.typewriteText(text);
  }

  typewriteText(text) {
    const length = text.length
    let i = 0
    this.time.addEvent({
      callback: () => {
        this.textObject.text += text[i]
        ++i
      },
      repeat: length - 1,
      delay: 10,
    });
  }
}
