import Phaser from 'phaser'
import { sceneEvents, sceneEventsEmitter } from './Events/EventsCenter'

export default class GameUI extends Phaser.Scene {
	constructor() {
		super('game-ui')
        
        this.hearts;
	}

	preload() {
	}

	create() {
        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        })

        this.hearts.createMultiple({
            key: 'ui-heart-full',
            setXY: {
                x: 10,
                y: 10,
                stepX: 16
            },
            quantity: 3
        })

        sceneEventsEmitter.on(sceneEvents.HEARTSCHANGED, this.handleHealthChanged, this)

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            sceneEvents.off(sceneEvents.HEARTSCHANGED, this.handleHealthChanged)
        })
	}

    handleHealthChanged(health) {
        this.hearts.children.each((heart, index) => {
            //@todo : to refactor
            if (health == 5 && index == 2) {
                heart.setTexture('ui-heart-half')
                return
            }

            if (health == 4 && index == 2) {
                heart.setTexture('ui-heart-empty')
                return
            }

            if (health == 3 && index == 1) {
                heart.setTexture('ui-heart-half')
                return
            }

            if (health == 2 && index == 1) {
                heart.setTexture('ui-heart-empty')
                return
            }

            if (health == 1 && index == 0) {
                heart.setTexture('ui-heart-half')
                return
            }

            if (health == 0 && index == 0) {
                heart.setTexture('ui-heart-empty')
                return
            }
        })
    }
}
