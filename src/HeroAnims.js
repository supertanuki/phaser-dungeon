import Phaser from 'phaser'

export const createHeroAnims = function(anims) {
	anims.create({
		key: 'hero-idle-down',
		frames: [{ key: 'hero', frame: 'run-down-2' }]
	});

	anims.create({
		key: 'hero-idle-up',
		frames: [{ key: 'hero', frame: 'run-up-4' }]
	});

	anims.create({
		key: 'hero-idle-side',
		frames: [{ key: 'hero', frame: 'run-side-2' }]
	});

	anims.create({
		key: 'hero-run-down',
		frames: anims.generateFrameNames('hero', { start: 1, end: 8, prefix: 'run-down-' }),
		repeat: -1,
		frameRate: 14
	});

	anims.create({
		key: 'hero-run-up',
		frames: anims.generateFrameNames('hero', { start: 1, end: 8, prefix: 'run-up-' }),
		repeat: -1,
		frameRate: 14
	});

	anims.create({
		key: 'hero-run-side',
		frames: anims.generateFrameNames('hero', { start: 1, end: 8, prefix: 'run-side-' }),
		repeat: -1,
		frameRate: 14
	});

	anims.create({
		key: 'hero-die',
		frames: anims.generateFrameNames('hero', { start: 1, end: 4, prefix: 'faint-' }),
		repeat: 0,
		frameRate: 14
	});
}
