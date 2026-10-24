export class Playback {
  constructor(onFrame) {
    this.onFrame = onFrame;
    this.progress = 1;
    this.playing = false;
  }
  stop() {
    this.playing = false;
    cancelAnimationFrame(this.frame);
  }
  seek(p) {
    this.stop();
    this.progress = Math.max(0, Math.min(1, p));
    this.onFrame(this.progress);
  }
  toggle() {
    if (this.playing) {
      this.stop();
      return;
    }
    if (this.progress >= 1) this.progress = 0;
    this.playing = true;
    let last = performance.now();
    const tick = (now) => {
      if (!this.playing) return;
      this.progress = Math.min(1, this.progress + (now - last) / 5000);
      last = now;
      this.onFrame(this.progress);
      if (this.progress < 1) this.frame = requestAnimationFrame(tick);
      else this.playing = false;
    };
    this.frame = requestAnimationFrame(tick);
  }
}
