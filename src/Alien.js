import 'phaser';
import { GC } from './scenes/GameScene';

class Alien extends Phaser.Physics.Arcade.Sprite {

  constructor(scene) {
    super(scene, 0, 0, "graphic");
  }

  activate(x, y) {
    this.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
  }

  deactivate() {
    this.setVisible(false);
    this.setActive(false);
  }
}

export class Alien1 extends Alien {

  constructor(scene) {
    super(scene);
    this.play('alien' + GC.ALIEN_1);
  }
}

export class Alien2 extends Alien {

  constructor(scene) {
    super(scene);
    this.play('alien' + GC.ALIEN_2);
  }
}

export class Alien3 extends Alien {

  constructor(scene) {
    super(scene);
    this.play('alien' + GC.ALIEN_3);
  }
}
