import { sceneEvents, sceneEventsEmitter } from "./Events/EventsCenter";
import { messageWorkflow } from "./Workflow/messageWorkflow";

export default class Workflow {
  constructor() {
    this.currentSprite = null;
    this.currentSpritePosition = {
      farmer: {
        currentMessage: -1,
        currentMessagePosition: 0,
      },
    };

    sceneEventsEmitter.on(
      sceneEvents.DiscussionStarted,
      this.startDiscussion,
      this
    );
    sceneEventsEmitter.on(
      sceneEvents.DiscussionContinuing,
      this.continueDiscussion,
      this
    );
  }

  getCurrentMessage() {
    const currentMessage = this.currentSpritePosition[this.currentSprite] ? this.currentSpritePosition[this.currentSprite].currentMessage : undefined
    const currentMessagePosition = this.currentSpritePosition[this.currentSprite] ? this.currentSpritePosition[this.currentSprite].currentMessagePosition : undefined

    if (undefined == currentMessage || undefined == currentMessagePosition) {
      return
    }

    try {
      return messageWorkflow[this.currentSprite][currentMessage].messages[currentMessagePosition]
    } catch (error) {
    }

    return
  }

  startDiscussion(sprite) {
    this.currentSpritePosition[sprite].currentMessage++;
    this.currentSpritePosition[sprite].currentMessagePosition = 0;
    this.currentSprite = sprite;
    const message = this.getCurrentMessage();

    if (!message) {
      this.sendLastMessage()
      return;
    }

    sceneEventsEmitter.emit(sceneEvents.MESSAGESSENT, message);
  }

  continueDiscussion() {
    this.currentSpritePosition[this.currentSprite].currentMessagePosition++;
    this.sendMessage()
  }

  sendLastMessage() {
    this.currentSpritePosition[this.currentSprite].currentMessage--
    this.sendMessage()
  }

  sendMessage() {
    const message = this.getCurrentMessage();

    if (!message) {
      sceneEventsEmitter.emit(sceneEvents.DiscussionEnded, this.currentSprite);
      return;
    }

    sceneEventsEmitter.emit(sceneEvents.MESSAGESSENT, message);
  }
}
