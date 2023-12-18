import Phaser from 'phaser'

export default class Hero extends Phaser.Physics.Arcade.Sprite {	
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture, frame)
	}
}
