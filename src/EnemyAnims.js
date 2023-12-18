import Phaser from 'phaser'

export const createEnemyAnims = function(anims) {
	anims.create({
		key: 'enemy-run',
		frames: anims.generateFrameNames('enemy', { start: 1, end: 4, prefix: 'big_demon_run_anim_f' }),
		repeat: -1,
		frameRate: 12
	});
}
