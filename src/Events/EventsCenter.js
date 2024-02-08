import Phaser from 'phaser'

const sceneEventsEmitter = new Phaser.Events.EventEmitter()

const sceneEvents = {
	'HEARTSCHANGED': 'HEARTSCHANGED',
	'GAMEOVER': 'GAMEOVER',
	'MESSAGESSENT': 'MESSAGESSENT',
}

export {
	sceneEventsEmitter,
	sceneEvents
}