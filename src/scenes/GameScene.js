import { Scene, Phaser } from 'phaser';
import { GC, STATE } from '../GC';
import Bomb from '../Bomb';
import Bullet from '../Bullet';
import AlienManager from '../AlienManager';
import ScoreManager from '../ScoreManager';
import rocketFactory from '../RocketFactory';

export default class GameScene extends Scene {

  constructor(config) {
    super({ key: 'GameScene' });
  }

  create () {
    this.createText();

    this.level = 1;
    this.sound.add('explosion');
    this.sound.add('shoot');
    this.cursors = this.input.keyboard.createCursorKeys();

    this.rocket = rocketFactory.create(this);
    this.bullets = this.physics.add.group({
      maxSize: 20,
      classType: Bullet,
      runChildUpdate: true
    });

    this.bombs = this.physics.add.group({
      maxSize: 20,
      classType: Bomb,
      runChildUpdate: true
    });
    this.alienManager = new AlienManager(this, this.level);

    this.physics.world.on('worldbounds', this.onWorldbounds, this);
    this.alienManager.addColider(this.bullets, this.alienHitEvent, this);
    this.alienManager.addColider(this.rocket, this.alienOnRocketEvent, this);
    this.physics.add.collider(this.rocket, this.bombs, this.bombHitEvent, null, this);

    this.input.keyboard.on("keydown", this.handleKey, this);

    this.scoreManager = new ScoreManager(this);
    this.scoreManager.print();
    this.state = STATE.RUN;
  }

  createText() {
    const sizeY = this.game.canvas.height;
    const sizeX = this.game.canvas.width;
    const textConfig =
      { fontSize: '44px',  fontFamily: 'Pixel', fill: "#ffffff" };

    this.gameoverText = this.add.text(sizeX / 2, sizeY / 2 - 100,
      'GAME OVER', textConfig)
      .setVisible(false)
      .setDepth(1);
    this.gameoverText.setOrigin(0.5);

    this.beginText = this.add.text(sizeX / 2, (sizeY / 2) - 60,
     'PRESS ANY KEY FOR NEW GAME', textConfig)
      .setVisible(false)
      .setDepth(1);
    this.beginText.setOrigin(0.5);
  }

  onWorldbounds(body) {
    const isBullet = this.bullets.contains(body.gameObject);
    if (isBullet) {
      body.gameObject.deactivate();
    }

    const isBomb = this.bombs.contains(body.gameObject);
    if (isBomb) {
      body.gameObject.deactivate();
    }

    if (this.state == STATE.RUN) {
      if (this.alienManager.onWorldbounds(body)) {
        this.gameover();
      }
    };
  };

  update() {
    this.handleCursor();
  }

  handleCursor() {
    if (this.state == STATE.RUN) {
      if (this.cursors.left.isDown) {
        this.rocket.setVelocityX(-160);
      } else if (this.cursors.right.isDown) {
        this.rocket.setVelocityX(160);
      } else {
        this.rocket.setVelocityX(0);
      }
    } else {
      this.rocket.setVelocityX(0);
    }
  }

  handleKey(e){
    switch(this.state) {
      case STATE.RUN:
        if(e.code == "Space") {
           this.fireBullet();
        }
        break;
      case STATE.READY:
        this.restartGame();
        break;
    }
  }

  fireBullet() {
    const bullet = this.bullets.get();
    if (bullet) {
      bullet.shoot(this.rocket.x-1, this.rocket.y-18);
    }
  }

  alienHitEvent(alien, bullet) {
    if (this.state == STATE.RUN && alien.active && bullet.active) {
      bullet.deactivate();
      alien.explode();
      this.scoreManager.point();
      if (this.alienManager.testAllAliensDead()) {
        this.levelUp();
      }
    }
  }

  alienOnRocketEvent(alien, rocket) {
    if (this.state == STATE.RUN && alien.active) {
      this.gameover();
    }
  }

  bombHitEvent(rocket, bomb) {
    if (this.state == STATE.RUN && bomb.active) {
      this.gameover();
    }
  }

  levelUp() {
    this.level++;
    this.time.addEvent(
      { delay: 2000, callback: this.restart(), callbackScope: this});﻿﻿
  }

  restart() {
    this.alienManager.restart(this.level);
  }

  gameover() {
    this.state = STATE.GAMEOVER;
    this.sound.play('explosion');
    this.rocket.play('explosion');
    this.time.removeAllEvents();
    this.alienManager.gameover();
    this.bullets.getChildren().forEach(
      function(bullet) { bullet.deactivate(); }
    );
    this.bombs.setVelocityX(0);
    this.bombs.setVelocityY(0);
    this.gameoverText.setVisible(true);
    this.aliensStartVelocity = 40;

    this.time.addEvent({
      delay: 3000,
      callback: function() { this.ready(); },
      callbackScope: this
    });
  }

  ready() {
    this.state = STATE.READY;
    this.beginText.setVisible(true);
  }

  restartGame() {
    this.state = STATE.RUN;
    this.level = 1;
    this.scoreManager.setHiScore();

    this.rocket.play('rocket');
    this.beginText.setVisible(false);
    this.gameoverText.setVisible(false);
    this.bombs.getChildren().forEach(
      function(bomb) { bomb.deactivate(); }
    );
    this.restart();
  }
}
