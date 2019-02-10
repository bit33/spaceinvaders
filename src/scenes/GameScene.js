import { Scene, Phaser } from 'phaser';
import Bomb from '../Bomb';
//import { Bullet } from '../Bullet';

export var GC = {
  ALIEN_1:    0,
  ALIEN_2:    2,
  ALIEN_3:    4,
  ROCKET:     6,
  EXPLOSION:  7
}

var STATE = {
  READY:    0,
  RUN:      1,
  GAMEOVER: 2
}

function rocketFactory(scene) {
  let rocket = scene.physics.add.sprite(300, 500, "graphic", GC.ROCKET)
    .setImmovable(true);

  rocket.setCollideWorldBounds(true);
  rocket.body.onWorldBounds = true;
  rocket.body.world.on('worldbounds', function(body) {
    if (body.gameObject === this) {
      this.setActive(false);
    }
  }, rocket);

  return rocket;
}

export default class GameScene extends Scene {

  constructor(config) {
    super({ key: 'GameScene' });
  }

  create () {
    let sizeY = this.game.canvas.height;
    let sizeX = this.game.canvas.width;
    let textConfig =
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

    this.sound.add('explosion');
    this.sound.add('shoot');

    textConfig =
      { fontSize: '16px',  fontFamily: 'Pixel', fill: "#ffffff" };

    this.add.text(16, 16, 'SCORE   HI-SCORE', textConfig);
    this.scoreText = this.add.text(22, 32, '', textConfig);

    this.rocket = rocketFactory(this);
    this.bullets = this.physics.add.group();
    this.aliens = this.physics.add.group();
    this.bombs = this.physics.add.group({
      maxSize: 3,
      classType: Bomb,
      runChildUpdate: true
    });

    this.aliensStartVelocity = 40;
    this.initAliens();
    this.physics.world.on('worldbounds', this.onWorldbounds, this);

    this.physics.add.collider(this.aliens, this.bullets, this.alienHitEvent, null, this);
    this.physics.add.collider(this.aliens, this.rocket, this.alienOnRocketEvent, null, this);
    this.physics.add.collider(this.rocket, this.bombs, this.bombHitEvent, null, this);

    this.input.keyboard.on("keydown", this.handleKey, this);

    this.hiScore = 0;
    this.score = 0;
    this.printScore();
    this.state = STATE.RUN;
  }

  initAliens() {
    this.makeAlienRow(0, GC.ALIEN_1);
    this.makeAlienRow(1, GC.ALIEN_1);
    this.makeAlienRow(2, GC.ALIEN_2);
    this.makeAlienRow(3, GC.ALIEN_2);
    this.makeAlienRow(4, GC.ALIEN_3);

    this.aliensVelocity = this.aliensStartVelocity;
    this.aliens.setVelocityX(this.aliensVelocity);

    this.alienThrowsBombInFuture();
  }

  makeAlienRow(row, alienType) {
    for (var column = 0; column <= 12; column++) {
      let x = 100 + (column * 54);
      let y = 70 + (row * 50);
      // Weird I have to have a graphic image in sprite creation otherwise
      // aliens don't bounce on world border
      let alien = this.physics.add.sprite(x, y, "graphic", alienType)
        .play('alien' + alienType);
      this.aliens.add(alien);
      alien.setCollideWorldBounds(true);
      alien.body.onWorldBounds = true;
    }
  }

  onWorldbounds(body) {
    console.log("onWorldBounds:" + body.gameObject);

    if (this.state == STATE.RUN) {

      const isBomb = this.bombs.contains(body.gameObject);
      if (isBomb) {
        body.gameObject.deactivate();
      }

      const isAlien = this.aliens.contains(body.gameObject); 
      if (isAlien) {
        console.log("alien");
        this.aliensVelocity = -this.aliensVelocity * 1.1;
        this.aliens.setVelocityX(this.aliensVelocity);

        function isNotLanded(alien) {
          return(alien.y+5 > maxY);
        }

        let maxY = this.game.canvas.height;
        if (!this.aliens.getChildren().find(isNotLanded)) {
          this.aliens.getChildren().forEach(
            function(alien) { alien.y += 5; }
          );
        } else {
          this.gameover();
        }
      };
    };
  };

  alienThrowsBombInFuture() {
    let delay = 400 + Math.random() * 4000;
    this.time.addEvent({
      delay: delay,
      callback: this.alienThrowsBomb,
      callbackScope: this
    });
  }

  alienThrowsBomb() {
    if (this.state == STATE.RUN) {
      let nrOfAliens = this.aliens.getChildren().length;
      if (nrOfAliens > 0) {
        let alienIndex = Math.floor(Math.random() * nrOfAliens);
        let alien = this.aliens.getChildren()[alienIndex];
        this.bombs.get().throw(alien.x, alien.y+10);
        this.alienThrowsBombInFuture();
      }
    }
  }


  update() {
    this.handleCursor();
  }

  handleCursor() {
    if (this.state == STATE.RUN) {
      var cursors = this.input.keyboard.createCursorKeys();
      if (cursors.left.isDown) {
        this.rocket.setVelocityX(-160);
      } else if (cursors.right.isDown) {
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
    this.sound.play('shoot');
    let bullet = this.physics.add.sprite(this.rocket.x-1, this.rocket.y-18, 'bullet');
    this.bullets.add(bullet);
    bullet.setVelocityY(-300);
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;
  }

  alienHitEvent(alien, bullet) {
    this.sound.play('explosion');
    alien.play('explosion');
    bullet.destroy();
    alien.destroy();
    this.score += 1;
    this.printScore();
    let allAliensAreDead = this.aliens.getChildren().length === 0;
    if (allAliensAreDead) this.levelUp();
  }

  alienOnRocketEvent() {
    if (this.state == STATE.RUN) {
      this.gameover();
    }
  }

  bombHitEvent() {
    if (this.state == STATE.RUN) {
      this.gameover();
    }
  }

  levelUp() {
    this.aliensStartVelocity = this.aliensStartVelocity + 20;
    this.time.addEvent(
      { delay: 2000, callback: this.initAliens, callbackScope: this});﻿﻿
  }

  gameover() {
    this.sound.play('explosion');
    this.rocket.play('explosion');
    this.state = STATE.GAMEOVER;
    this.aliens.setVelocityX(0);
    this.aliens.setVelocityY(0);
    //this.bombs.setVelocityY(0);
    this.gameoverText.setVisible(true);
    this.aliensStartVelocity = 40;

    this.time.addEvent({
      delay: 3000,
      callback: function() { this.ready(); },
      callbackScope: this
    });
  }

  ready() {
    this.beginText.setVisible(true);
    this.state = STATE.READY;
  }

  restartGame() {
    if (this.score > this.hiScore) {
      this.hiScore = this.score;
    }
    this.score = 0;
    this.printScore();

    this.state = STATE.RUN;
    this.rocket.play('rocket');
    this.beginText.setVisible(false);
    this.gameoverText.setVisible(false);
    this.aliens.clear(true, true);
    this.bombs.getChildren().forEach(
      function(bomb) { bomb.deactivate(); }
    );
    this.initAliens();
  }

  padding(s) {
    return s.toLocaleString('en',
      {minimumIntegerDigits:4,minimumFractionDigits:0,useGrouping:false});
  }

  printScore() {
    this.scoreText.setText(
      this.padding(this.score) + '     ' + this.padding(this.hiScore)
    );
  }
}
