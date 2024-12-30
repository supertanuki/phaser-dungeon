import Phaser from "phaser";
import { sceneEvents, sceneEventsEmitter } from "./Events/EventsCenter";

export default class Message extends Phaser.Scene {
  constructor() {
    super("message");
    this.textObject = null
    this.currentText = ''
    this.delay = 20
  }

  create() {
    const config = this.sys.game.config;
    this.textObject = this.add.text(config.width / 2, config.height, "", {
      font: "14px Arial",
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
    sceneEventsEmitter.on(sceneEvents.DiscussionEnded, this.handleDiscussionEnd, this)
  }

  handleDiscussionEnd() {
    this.textObject.text = ''
    this.textObject.setVisible(false)
  }

  handleMessage(text) {
    if (this.textObject.visible && text === this.currentText) {
        return
    }

    this.textObject.text = ''
    this.currentText = text
    this.textObject.setVisible(true)
    this.typewriteText(text)
  }

  typewriteText(text) {
    const splitedText = text.split(' ');
    const length = splitedText.length
    let i = 0
    this.time.addEvent({
      callback: () => {
        this.textObject.text += splitedText[i] + ' '
        ++i

        if (i >= length) {
          sceneEventsEmitter.emit(sceneEvents.DiscussionWaiting)
        }
      },
      repeat: length - 1,
      delay: this.delay,
    });
  }
}
