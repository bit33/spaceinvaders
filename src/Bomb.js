import 'phaser';

export default class Bomb extends Phaser.Physics.Arcade.Sprite {

  constructor(scene) {
    super(scene, 0, 0, 'bomb');
    this.play('bomb');
  }

  throw(x, y) {
    this.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityY(300);
  }

  deactivate() {
    this.setVisible(false);
    this.setActive(false);
  }
}
