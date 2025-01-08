import { sceneEvents, sceneEventsEmitter } from "./Events/EventsCenter";
import { messageWorkflow } from "./Workflow/messageWorkflow";

export default class Workflow {
  constructor() {
    this.currentSprite = null;
    this.unlockedEvents = [];
    // to improve : create data on first use
    this.spritePosition = {
      farmer: {
        currentThread: -1,
        currentMessagePosition: 0,
      },
      miner: {
        currentThread: -1,
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
    sceneEventsEmitter.on(
      sceneEvents.EventsUnlocked,
      this.unlockMessages,
      this
    );
  }

  getCurrentThread() {
    return this.spritePosition[this.currentSprite]
      ? this.spritePosition[this.currentSprite].currentThread
      : undefined;
  }

  getCurrentMessage() {
    const currentThread = this.getCurrentThread();
    const currentMessagePosition = this.spritePosition[
      this.currentSprite
    ]
      ? this.spritePosition[this.currentSprite].currentMessagePosition
      : undefined;

    if (undefined == currentThread || undefined == currentMessagePosition) {
      return;
    }

    const dependingOn = messageWorkflow[this.currentSprite][currentThread]?.dependingOn;
    if (dependingOn && !dependingOn.every(item => this.unlockedEvents.includes(item))) {
      return;
    }

    try {
      return messageWorkflow[this.currentSprite][currentThread].messages[
        currentMessagePosition
      ];
    } catch (error) {}

    return;
  }

  startDiscussion(sprite) {
    this.spritePosition[sprite].currentThread++;
    this.spritePosition[sprite].currentMessagePosition = 0;
    this.currentSprite = sprite;
    const message = this.getCurrentMessage();

    if (!message) {
      this.sendLastMessage();
      return;
    }

    this.sendMessage()
  }

  continueDiscussion() {
    this.spritePosition[this.currentSprite].currentMessagePosition++;
    this.sendMessage();
  }

  sendLastMessage() {
    this.spritePosition[this.currentSprite].currentThread--;
    this.sendMessage();
  }

  saveUnlockedEvent() {
    const currentThread = this.getCurrentThread();
    const unlockedEvents =
      messageWorkflow[this.currentSprite][currentThread].unlockEvents;

    if (unlockedEvents) {
      this.unlockedEvents.push(...unlockedEvents);
      sceneEventsEmitter.emit(sceneEvents.EventsUnlocked, {
        newUnlockedEvents: unlockedEvents,
        unlockedEvents: this.unlockedEvents,
      });
    }
  }

  sendMessage() {
    const message = this.getCurrentMessage();

    if (!message) {
      this.saveUnlockedEvent();
      sceneEventsEmitter.emit(sceneEvents.DiscussionEnded, this.currentSprite);
      return;
    }

    sceneEventsEmitter.emit(sceneEvents.DiscussionInProgress);
    sceneEventsEmitter.emit(sceneEvents.MessageSent, message);
  }

  unlockMessages(data) {
    for (const sprite in messageWorkflow) {
      for (const threadIndex in messageWorkflow[sprite]) {
        const dependingOn = messageWorkflow[sprite][threadIndex].dependingOn

        if (dependingOn && dependingOn.every(item => data.newUnlockedEvents.includes(item))) {
          this.spritePosition[sprite].currentThread = threadIndex * 1 - 1
          this.spritePosition[sprite].currentMessagePosition = 0
        }
      }
    }
  }
}
