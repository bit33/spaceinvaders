import 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {

  constructor(scene) {
    super(scene, 0, 0, 'bullet');
  }

  shoot(x, y) {
    this.scene.sound.play('shoot');
    this.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityY(-300);

  }

  deactivate() {
    this.setVisible(false);
    this.setActive(false);
  }
}
