const Direction = {
	'UP': 'UP',
	'DOWN': 'DOWN',
	'RIGHT': 'RIGHT',
	'LEFT': 'LEFT'
}

const randomDirection = (exclude) => {
	const newDirectionIndex = Phaser.Math.Between(0, 4);
	let newDirection = null;

	if (newDirectionIndex === 0) {
		newDirection = Direction.DOWN;
	} else if (newDirectionIndex === 1) {
		newDirection = Direction.RIGHT;
	} else if (newDirectionIndex === 2) {
		newDirection = Direction.LEFT;
	} else if (newDirectionIndex === 3) {
		newDirection = Direction.UP;
	}

	if (newDirection === exclude) {
		return randomDirection(exclude);
	}

	return newDirection;
}

export { Direction, randomDirection }