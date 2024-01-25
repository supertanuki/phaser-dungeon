import Phaser from 'phaser'

const sceneEventsEmitter = new Phaser.Events.EventEmitter()

const sceneEvents = {
	'HEARTSCHANGED': 'HEARTSCHANGED',
	'GAMEOVER': 'GAMEOVER'
}

export {
	sceneEventsEmitter,
	sceneEvents
}