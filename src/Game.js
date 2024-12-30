import Phaser from "phaser";
import { createEnemyAnims } from "./EnemyAnims";
import { createHeroAnims } from "./HeroAnims";
import Enemy from "./Enemy";
import { sceneEventsEmitter, sceneEvents } from "./Events/EventsCenter";
import Jeep from "./Jeep";
import Workflow from "./Workflow";
import "./Sprites/Farmer";
import isMobile from "./Utils/isMobile";

const DiscussionStatus = {
  'NONE': 'NONE',
  'READY': 'READY',
	'STARTED': 'STARTED',
	'WAITING': 'WAITING',
}

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
    this.controls = null;
    this.cursors = null;
    this.hero = null;
    this.joystick = null;
    this.speed = 100;

    this.goingLeft = false;
    this.goingRight = false;
    this.goingDown = false;
    this.goingUp = false;
    this.goingAngle = null;
    this.land = null;
    this.topObjects = null
    this.hit = 0;
    this.died = false;

    this.heroHealth = 10;
    this.enemies;
    this.currentDiscussionStatus = DiscussionStatus.NONE;
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.scene.run("game-ui")
    this.scene.run("message")

    //createEnemyAnims(this.anims);
    createHeroAnims(this.anims);

    const map = this.make.tilemap({ key: "dungeon" });
    const tileset = map.addTilesetImage("tiles", "tiles");
    this.land = map.createLayer("land", tileset);
    this.land.setCollisionByProperty({ collide: true });
    map.createLayer("subbottom", tileset);
    map.createLayer("bottom", tileset);

    map.getObjectLayer('hero').objects.forEach(heroPosition => {
      this.hero = this.physics.add.sprite(heroPosition.x, heroPosition.y, "hero", "run-down-1")
    });

    this.hero.body.setSize(this.hero.width * 0.5, this.hero.height * 0.8);
    this.hero.anims.play("hero-idle-down", true);

    map.getObjectLayer('farmer').objects.forEach(farmerPosition => {
      this.farmer = this.add.farmer(farmerPosition.x, farmerPosition.y, 'farmer')
      this.farmer.setImmovable(true)
    });

    // Add jeeps
    const jeepsLayer = map.getObjectLayer('jeeps')
    jeepsLayer.objects.forEach(jeepObject => {
      this.addEnemy(jeepObject.x, jeepObject.y);
    });

    // Add trees
    this.anims.create({
      key: 'animated-tree',
      frames: this.anims.generateFrameNames('tree', { start: 0, end: 7, prefix: 'tree-' }),
      repeat: -1,
      frameRate: 6
    });

    const treesLayer = map.getObjectLayer('trees')
    // sort tress in order to draw trees from top to down
    treesLayer.objects.sort((a, b) => a.y - b.y);
    treesLayer.objects.forEach(treeObject => {
      const tree = this.add.sprite(treeObject.x + 3, treeObject.y - 50, "tree");
      tree.anims.play("animated-tree");
    });

    this.topObjects = map.createLayer("top", tileset);
    this.topObjects.setCollisionByProperty({ collide: true });

    this.physics.add.collider(this.farmer, this.land, () => {
      this.farmer.changeDirection()
    });
    this.physics.add.collider(this.farmer, this.topObjects, () => {
      this.farmer.changeDirection()
    });

    this.physics.add.collider(this.farmer, this.hero, () => {
      sceneEventsEmitter.emit(sceneEvents.DiscussionReady, 'farmer')
      this.farmer.readyToChat()
    });

    this.physics.add.collider(this.hero, this.land);
    this.physics.add.collider(this.hero, this.topObjects);

    this.cameras.main.startFollow(this.hero, true);
    this.createControls()

    sceneEventsEmitter.on(sceneEvents.DiscussionReady, this.handleDiscussionReady, this)
    sceneEventsEmitter.on(sceneEvents.DiscussionStarted, this.handleDiscussionStarted, this)
    sceneEventsEmitter.on(sceneEvents.DiscussionWaiting, this.handleDiscussionWaiting, this)
    sceneEventsEmitter.on(sceneEvents.DiscussionEnded, this.handleDiscussionEnded, this)

    // always set it at the end to priorize events listeners
    new Workflow()
  }

  handleDiscussionReady() {
    this.currentDiscussionStatus = DiscussionStatus.READY

    this.time.addEvent({
      callback: () => {
        if (this.currentDiscussionStatus == DiscussionStatus.READY) {
          this.currentDiscussionStatus = DiscussionStatus.NONE
          this.farmer.stopChatting()
          this.farmer.move()
        }
      },
      delay: 2000,
    });
  }

  handleDiscussionStarted() {
    this.currentDiscussionStatus = DiscussionStatus.STARTED
  }

  handleDiscussionWaiting() {
    this.currentDiscussionStatus = DiscussionStatus.WAITING
  }

  handleDiscussionEnded(sprite) {
    this.currentDiscussionStatus = DiscussionStatus.NONE

    if ('farmer' == sprite) {
      this.farmer.stopChatting()
      this.time.addEvent({
        callback: () => {
          if (this.currentDiscussionStatus == DiscussionStatus.NONE) {
            this.farmer.move()
          }
        },
        delay: 2000,
      });
    }
  }

  createControls() {
    this.cursors = this.input.keyboard.addKeys({
      space: "space",
      up: "up",
      down: "down",
      left: "left",
      right: "right",
    });

    this.input.keyboard.on(
      "keydown",
      (event) => {
        if (event.key === "ArrowUp") {
          this.goingUp = true;
          this.goingDown = false;
        } else if (event.key === "ArrowDown") {
          this.goingDown = true;
          this.goingUp = false;
        } else if (event.key === "ArrowLeft") {
          this.goingLeft = true;
          this.goingRight = false;
        } else if (event.key === "ArrowRight") {
          this.goingRight = true;
          this.goingLeft = false;
        } else if (event.keyCode === 32) {
          this.handleAction()
        }
      },
      this
    );

    this.input.keyboard.on(
      "keyup",
      function (event) {
        if (event.key == "ArrowUp") {
          this.goingUp = false;
        } else if (event.key == "ArrowDown") {
          this.goingDown = false;
        } else if (event.key == "ArrowLeft") {
          this.goingLeft = false;
        } else if (event.key == "ArrowRight") {
          this.goingRight = false;
        }
      },
      this
    );
    
    this.addJoystickForMobile()
  }

  handleAction() {
    if (this.currentDiscussionStatus == DiscussionStatus.WAITING) {
      this.currentDiscussionStatus = DiscussionStatus.STARTED
      sceneEventsEmitter.emit(sceneEvents.DiscussionContinuing);
      return
    }

    if (this.currentDiscussionStatus == DiscussionStatus.READY) {
      sceneEventsEmitter.emit(sceneEvents.DiscussionStarted, 'farmer'); // to improve
      return
    }
  }

  addEnemy(x, y) {
    if (!this.enemies) {
      this.enemies = this.physics.add.group({
        //classType: Enemy,
        classType: Jeep,
        createCallback: (gameObject) => {
          gameObject.body.onCollide = true;
        },
      });
      this.physics.add.collider(this.enemies, this.land);
      this.physics.add.collider(this.enemies, this.enemies);
      this.physics.add.collider(
        this.enemies,
        this.hero,
        this.handleHeroEnemyCollision,
        undefined,
        this
      );
    }

    this.enemies.get(x, y, "enemy");
  }

  addJoystickForMobile() {
    if (!isMobile()) {
      return;
    }

    this.joystick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 100,
      y: 200,
      radius: 100,
      base: this.add.circle(0, 0, 50, 0xff5544, 0.4),
      thumb: this.add.circle(0, 0, 30, 0xcccccc, 0.3),
      dir: "8dir",
      forceMin: 16,
      enable: true,
      inputEnable: true,
      fixed: true,
    });

    // Make floating joystick
    this.input.on(
      "pointerdown",
      function (pointer) {
        this.joystick.setPosition(pointer.x, pointer.y);
        this.joystick.setVisible(true);
      },
      this
    );

    this.joystick.on(
      "update",
      function () {
        this.goingAngle = this.joystick.angle;

        if (this.joystick.left) {
          this.goingLeft = true;
          this.goingRight = false;

          if (177.5 < this.goingAngle || -177.5 > this.goingAngle) {
            this.goingUp = false;
            this.goingDown = false;
          }
        } else if (this.joystick.right) {
          this.goingRight = true;
          this.goingLeft = false;

          if (22.5 > this.goingAngle && -22.5 < this.goingAngle) {
            this.goingUp = false;
            this.goingDown = false;
          }
        }

        if (this.joystick.up) {
          this.goingUp = true;
          this.goingDown = false;

          if (-67.5 > this.goingAngle && -112.5 < this.goingAngle) {
            this.goingRight = false;
            this.goingLeft = false;
          }
        } else if (this.joystick.down) {
          this.goingDown = true;
          this.goingUp = false;

          if (67.5 < this.goingAngle && 112.5 > this.goingAngle) {
            this.goingRight = false;
            this.goingLeft = false;
          }
        }
      },
      this
    );

    this.joystick.on(
      "pointerup",
      function () {
        this.joystick.setVisible(false);
        this.stopHero();
      },
      this
    );

    this.joystick.on("pointerdown", this.handleAction, this)
  }

  handleHeroEnemyCollision(hero, enemy) {
    if (this.died) {
      return;
    }

    const dx = this.hero.x - enemy.x;
    const dy = this.hero.y - enemy.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.hero.setVelocity(dir.x, dir.y);

    if (this.hit > 0) {
      return;
    }

    this.cameras.main.shake(300, 0.01);
    this.hit = 1;
    --this.heroHealth;
    sceneEventsEmitter.emit(sceneEvents.HEARTSCHANGED, this.heroHealth);
  }

  goLeft() {
    this.hero.setVelocityX(-this.speed);
    this.hero.scaleX = -1;
    this.hero.body.offset.x = 24;
  }

  goRight() {
    this.hero.setVelocityX(this.speed);
    this.hero.scaleX = 1;
    this.hero.body.offset.x = 8;
  }

  goUp() {
    this.hero.setVelocityY(-this.speed);
    //this.hero.body.offset.y = 8;
  }

  goDown() {
    this.hero.setVelocityY(this.speed);
    //this.hero.body.offset.y = 4;
  }

  animateToLeft() {
    this.hero.anims.play("hero-run-side", true);
  }

  animateToRight() {
    this.hero.anims.play("hero-run-side", true);
  }

  animateToUp() {
    this.hero.anims.play("hero-run-up", true);
  }

  animateToDown() {
    this.hero.anims.play("hero-run-down", true);
  }

  stopHero() {
    this.goingLeft = false;
    this.goingRight = false;
    this.goingDown = false;
    this.goingUp = false;

    const parts = this.hero.anims.currentAnim.key.split("-");
    parts[1] = "idle";
    this.hero.anims.play(parts.join("-"));
    this.hero.setVelocity(0, 0);
  }

  handleHit() {
    ++this.hit;
    this.hero.setTint(0xff0000);

    if (this.hit > 10) {
      this.hit = 0;
      this.hero.setTint(0xffffff);
    }
  }

  gameOver() {
    this.hero.anims.play("hero-die", true);
    this.hero.setVelocity(0, 0);
    this.died = true;

    this.add.text(this.hero.x - 88, this.hero.y - 28, 'GAME OVER', {
			fontFamily: 'Quicksand',
			fontSize: '28px',
			color: '#000'
		})
    this.add.text(this.hero.x - 90, this.hero.y - 30, 'GAME OVER', {
			fontFamily: 'Quicksand',
			fontSize: '28px',
			color: '#fff'
		})

    sceneEventsEmitter.emit(sceneEvents.GAMEOVER);

    setTimeout(() => {
      if (confirm("Game Over ! Rejouer ?")) {
        location.reload();
      }
    }, 3000);
  }

  update(time, delta) {
    if (this.died) {
      return;
    }

    if (this.hit > 0) {
      this.handleHit();
      return;
    }

    if (this.heroHealth <= 0) {
      this.gameOver();
      return;
    }

    if (!this.cursors || !this.hero) {
      return;
    }

    this.hero.body.setVelocity(0);


    if (DiscussionStatus.STARTED === this.currentDiscussionStatus || DiscussionStatus.WAITING == this.currentDiscussionStatus) {
      this.stopHero()
      return
    }


    if (this.goingLeft) {
      this.goLeft();
    } else if (this.goingRight) {
      this.goRight();
    }

    if (this.goingUp) {
      this.goUp();
    } else if (this.goingDown) {
      this.goDown();
    }

    // Animation need to be done once
    if (
      this.goingUp &&
      (null === this.goingAngle ||
        (-45 > this.goingAngle && -135 <= this.goingAngle))
    ) {
      this.animateToUp();
    } else if (
      this.goingDown &&
      (null === this.goingAngle ||
        (45 < this.goingAngle && 135 >= this.goingAngle))
    ) {
      this.animateToDown();
    } else if (
      this.goingRight &&
      (null === this.goingAngle ||
        (45 > this.goingAngle && -45 <= this.goingAngle))
    ) {
      this.animateToRight();
    } else if (this.goingLeft) {
      this.animateToLeft();
    }

    if (
      !this.goingDown &&
      !this.goingUp &&
      !this.goingRight &&
      !this.goingLeft
    ) {
      this.stopHero();
    }
  }
}
