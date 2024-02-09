class Farmer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    scene.anims.create({
      key: "farmer-walk-down",
      frames: scene.anims.generateFrameNames("farmer", {
        start: 1,
        end: 3,
        prefix: "walk-down-",
      }),
      repeat: -1,
      frameRate: 7,
    });

    scene.anims.create({
      key: "farmer-idle",
      frames: [{ key: "farmer", frame: "walk-down-2" }],
    });
  }

  move() {
    this.anims.play("farmer-walk-down", true);
    this.setVelocity(0, 10)
    this.setScale(1)
    this.setImmovable(true)
  }

  stopMoving() {
    this.play('farmer-idle')
    this.setVelocity(0)
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }
}

Phaser.GameObjects.GameObjectFactory.register('farmer', function (x, y, texture, frame) {
	const sprite = new Farmer(this.scene, x, y, texture, frame)
	
  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

  this.displayList.add(sprite);
  this.updateList.add(sprite);

	return sprite
})
