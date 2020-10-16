AFRAME.registerComponent('scene-component', {

  // to fix a couple of AR.js bugs, we can add a few custom events in the scene component

  init: function () {


    this.sWidth = null;
    this.sHeight = null;
    this.videoAspect = 1;

    window.scene = this.el;


    // It's useful to know when the video (webcam) has completed loading so we can get the
    // video resolution. This helps us address AR.js's portrait/landscape problem.

    // first we listen to the built-in arjs-video-loaded event
    window.addEventListener('arjs-video-loaded', () => {
      const videoEl = document.querySelector('#arjs-video');

      // then we need to wait until the video data is loaded
      videoEl.onloadeddata = () => {
        this.videoAspect = videoEl.videoWidth / videoEl.videoHeight;
        window.dispatchEvent(new CustomEvent('webcam-ready'));
        this.resize();
      }
    })
    
  },

  resize: function () {

    // sWidth is screen width, rWidth is render width

    const maxDPR = 2;
    const dpr = Math.min(this.el.renderer.getPixelRatio(), maxDPR);

    this.sWidth = window.innerWidth;
    this.sHeight = window.innerHeight;

    const portrait = this.sHeight > this.sWidth;

    const rWidth = Math.ceil(this.sHeight * this.videoAspect);
    const rHeight = this.sHeight;

    const uvAspect = this.sWidth / rWidth;

    /**
     * normally our canvas 'width' attribute (not CSS width), would be set to the screen width * dpr
     * for example, with a DPR of 2, we'd be rendering the canvas at twice the resolution and
     * then scaling it down to the window size with the CSS width.
     * Unfortunately, our portrait issue disparity between the webcam video input resolution
     * and the displayed portrait resolution means the canvas width attribute isn't as high as it should be
     * This is set by AR.js and I believe it's been addressed but is not yet included with aframe-ar
     * 
     * This canvas fix works but we lose a little render resolution. It doesn't seem too noticable.
     */

    const canvas = this.el.canvas;

    const leftX = (rWidth - this.sWidth) * 0.5;

    canvas.style.left = `-${leftX}px`;
    canvas.style.width = `${rWidth}px`;

    window.dispatchEvent(new CustomEvent('custom-resize', { 
      detail: { 
        sWidth: this.sWidth,
        sHeight: this.sHeight,
        rWidth,
        rHeight,
        uvAspect 
      } 
    }))

  },


  tick: function() {

    // making a custom resize trigger in the tick as window resize event is called all the time
    if (this.sWidth !== window.innerWidth || this.sHeight !== window.innerHeight) {
      this.resize();
    }

  }
});