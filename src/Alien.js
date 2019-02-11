import 'phaser';
import { GC } from './GC';

class Alien extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, alienType) {
    super(scene, 0, 0, "graphic", alienType);
    this.alienType = alienType;
  }

  activate(x, y) {
    this.play("alien" + this.alienType);
    this.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.enableBody(true, x, y, true, true);
  }

  deactivate() {
    this.disableBody(true, true);
  }

  explode() {
    this.scene.sound.play('explosion');
    this.deactivate();
  }
}

export class Alien1 extends Alien {

  constructor(scene) {
    super(scene, GC.ALIEN_1);
  }
}

export class Alien2 extends Alien {

  constructor(scene) {
    super(scene, GC.ALIEN_2);
  }
}

export class Alien3 extends Alien {

  constructor(scene) {
    super(scene, GC.ALIEN_3);
  }
}
