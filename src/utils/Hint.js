export default class Hint {

  /**
   * The goal of this class is to display timed hint overlays to help the user
   * understand the interactive elements.
   */

  constructor({duration, delay, maxNumDisplays, animation}) {

    // default vars
    const defMaxNumDisplays = 1;
    const defDuration = 2000;
    const defDelay = 0;

    // input vars
    this.duration = duration || duration === 0 ? duration : defDuration;
    this.delay = delay || defDelay;
    this.maxNumDisplays = maxNumDisplays || defMaxNumDisplays;
    this.animation = animation;

    // state vars
    this.currNumDisplays = 0;
    this.delayTimeout = null;
    this.displayTimeout = null;
    this.isVisible = false;
    this.enabled = true;

  }

  setVisible(visible, incrementNumDisplays) {

    console.log(`setting hint visibility to ${visible}.`);

    // rather than directly controlling elements, we can call passed-in play/stop functions
    if (visible) {
      typeof this.animation?.start === 'function' && this.animation.start();
    } else {
      typeof this.animation?.stop === 'function' && this.animation.stop();
    }
    
    this.isVisible = visible;

    // incrementing the number of displays must be done actively
    // this is so we can decide when the hint has been officially shown
    // for example, if we are showing the hint but then lose the product tracking
    // we probably shouldnt count it.

    if (incrementNumDisplays) {
      console.log('NumDisplays incremented!');
      this.currNumDisplays++;
      this.enabled = !(this.currNumDisplays >= this.maxNumDisplays);
    }

  }

  startDelayTimer() {

    // the hint delay is a period of time (perhaps user idle time) where the user is doing
    // nothing and we are waiting to show a hint

    this.delayTimeout = setTimeout(() => {

      // we've reached the end of the timer without it being cancelled, so we show the hint
      console.log('delay timer finished.');
      this.setVisible(true);
      this.startDisplayTimer();

    }, this.delay);

    console.log('delay timer started.');

  }

  cancelDelayTimer() {

    clearTimeout(this.delayTimeout);
    this.delayTimeout = null;
    console.log('delay timer canceled.');
  }

  startDisplayTimer() {

    // the hint display timer times how long the hint is displaying
    
    this.displayTimeout = setTimeout(() => {

      console.log('display timer finished.');
      // now hide the hint
      this.setVisible(false, true);

    }, this.duration);

    console.log('display timer started.');

  }

  cancelDisplayTimer() {

    clearTimeout(this.displayTimeout);
    this.displayTimeout = null;
    console.log('display timer canceled.');

  }

  start(playAnimation) {

    if (!this.enabled) {
      console.log('hints not enabled.');
      return;
    }
    this.playAnimation = playAnimation;
    this.startDelayTimer();

  }

  stop(stopAnimation) {

    // check if we are in the delay timer, or the display timer

    if (this.delayTimeout) {
      this.cancelDelayTimer();
    }

    if (this.displayTimeout) {
      this.cancelDisplayTimer();
    }
    // always set visible to false
    this.stopAnimation = stopAnimation;
    this.setVisible(false);

  }


}