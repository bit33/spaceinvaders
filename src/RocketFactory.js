import { GC } from './GC';

class RocketFactory {
  create(scene) {
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
}

const rocketFactory = new RocketFactory();

export default rocketFactory;
