import Phaser from 'phaser'

const sceneEventsEmitter = new Phaser.Events.EventEmitter()

const sceneEvents = {
	'HEARTSCHANGED': 'HEARTSCHANGED',
	'GAMEOVER': 'GAMEOVER',
	'DiscussionReady': 'DiscussionReady',
	'DiscussionStarted': 'DiscussionStarted',
	'DiscussionWaiting': 'DiscussionWaiting',
	'DiscussionEnded': 'DiscussionEnded',
	'DiscussionContinuing': 'DiscussionContinuing',
	'MESSAGESSENT': 'MESSAGESSENT',
}

export {
	sceneEventsEmitter,
	sceneEvents
}