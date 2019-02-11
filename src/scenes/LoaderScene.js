import { Scene } from 'phaser';
import { GC } from '../GC';

export default class LoaderScene extends Scene {

  constructor(config) {
    super({ key: 'LoaderScene' });
  }

  preload () {
    this.load.spritesheet('graphic', 'assets/spaceinvaders.png', {
      frameWidth: 13*4,
      frameHeight: 9*4
    });
    this.load.spritesheet('bomb', 'assets/bomb.png', {
      frameWidth: 3*4,
      frameHeight: 27//7*4
    });

    this.load.image('bullet', 'assets/bullet.png');
    this.load.audio('explosion', 'assets/audio/explosion.wav');
    this.load.audio('shoot', 'assets/audio/shoot.wav');
  }

  create () {
    this.animFactory();
    this.scene.start('GameScene');
  }

  animFactory() {
    this.alienAnimFactory(GC.ALIEN_1);
    this.alienAnimFactory(GC.ALIEN_2);
    this.alienAnimFactory(GC.ALIEN_3);

    this.anims.create({
      key: 'explosion',
      frames: this.anims.generateFrameNumbers('graphic', {start: 7, end: 7 }),
      frameRate: 1,
      repeat: 1
    });

    this.anims.create({
      key: 'rocket',
      frames: this.anims.generateFrameNumbers('graphic',
        {start: GC.ROCKET, end: GC.ROCKET }),
      frameRate: 0,
      repeat: 0
    });

    this.anims.create({
      key: 'bomb',
      frames: this.anims.generateFrameNumbers('bomb', {start: 0, end: 1 }),
      frameRate: 6,
      repeat: -1
    });
  }

  alienAnimFactory(alienType) {
    this.anims.create({
        key: 'alien' + alienType,
        frames: this.anims.generateFrameNumbers('graphic',
          { start: alienType, end: alienType + 1 }),
        frameRate: 2.5,
        repeat: -1
    });
  }
}
