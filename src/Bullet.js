import 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {

  constructor(scene) {
    super(scene, 0, 0, 'bullet');
  }

  shoot(x, y) {
    this.scene.sound.play('shoot');
    this.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.enableBody(true, x, y, true, true);
    this.setVelocityY(-300);
  }

  deactivate() {
    this.disableBody (true, true);
  }
}
