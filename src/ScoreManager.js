function padding(s) {
  return s.toLocaleString('en',
    {minimumIntegerDigits:4,minimumFractionDigits:0,useGrouping:false});
}

export default class ScoreManager {

  constructor(scene) {
    const textConfig =
      { fontSize: '16px',  fontFamily: 'Pixel', fill: "#ffffff" };
    scene.add.text(16, 16, 'SCORE   HI-SCORE', textConfig);
    this.scoreText = scene.add.text(22, 32, '', textConfig);
    this.hiScore = 0;
    this.score = 0;
  }

  setHiScore() {
    if (this.score > this.hiScore) {
      this.hiScore = this.score;
    }
    this.score = 0;
    this.print();
  }

  point() {
    this.score++;
    this.print();
  }

  print() {
    this.scoreText.setText(
      padding(this.score) + '     ' + padding(this.hiScore)
    );
  }

}
