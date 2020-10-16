AFRAME.registerComponent('scene-component', {

  // to fix a couple of AR.js bugs, we can add a few custom events in the scene component

  init: function () {


    this.sWidth = null;
    this.sHeight = null;
    this.vWidth = null;
    this.vHeight = null;

    window.scene = this.el;


    // It's useful to know when the video (webcam) has completed loading so we can get the
    // video resolution. This helps us address AR.js's portrait/landscape problem.

    // first we listen to the built-in arjs-video-loaded event
    window.addEventListener('arjs-video-loaded', () => {
      const videoEl = document.querySelector('#arjs-video');

      // then we need to wait until the video data is loaded
      videoEl.onloadeddata = () => {

        this.vWidth = videoEl.videoWidth;
        this.vHeight = videoEl.videoHeight;
      
        window.video = videoEl;
        window.dispatchEvent(new CustomEvent('webcam-ready'));
        this.resize();
      }
    })

    window.onorientationchange = function() { 
      console.log('orientation change, reloading.');
      window.location.reload();  
    };
    
  },

  resize: function () {

    if(!this.vWidth || !this.vHeight) return;

    // sWidth is screen width, rWidth is render width

    const maxDPR = 2;
    const dpr = Math.min(this.el.renderer.getPixelRatio(), maxDPR);

    this.sWidth = window.innerWidth;
    this.sHeight = window.innerHeight;

    const sPortrait = this.sHeight >= this.sWidth;
    const sLandscape = this.sHeight < this.sWidth;
    const vPortrait = this.vHeight >= this.vWidth;
    const vLandscape = this.vHeight < this.vWidth;

    // sometimes the webcam video stays in landscape, even when the device is portrait, COOL!
    const calcWidthFromHeight = sPortrait;
    const calcHeightFromWidth = sLandscape;

    const vAspect = vPortrait ? this.vHeight / this.vWidth : this.vWidth / this.vHeight;

    const rWidth = calcWidthFromHeight ? Math.ceil(this.sHeight * vAspect) : this.sWidth;
    const rHeight = calcHeightFromWidth ? Math.ceil(this.sWidth * vAspect) : this.sHeight;

    const leftCanvasOffset = (rWidth - this.sWidth) * 0.5;
    const bottomCanvasOffset = (rHeight - this.sHeight) * 0.5;

    const uvX = vPortrait ? (rWidth / this.vWidth * this.vHeight / rHeight) : 1;
    const uvY = sLandscape ? 0.58 : 1;

    const uvCoeff = new THREE.Vector2(uvX, uvY);


    // alert(
    //   `sWidth: ${this.sWidth}, sHeight: ${this.sHeight}\n
    //   rWidth: ${rWidth}, rHeight: ${rHeight}\n
    //   vWidth: ${this.vWidth}, vHeight: ${this.vHeight}\n
    //   leftCanvasOffset: ${-leftCanvasOffset}, bottomCanvasOffset: ${-bottomCanvasOffset}\n
    //   vAspect: ${vAspect}\n
    //   uvCoeff: ${uvX}, ${uvY}.
    //   `);

    // console.log('sWidth', this.sWidth);
    // console.log('sHeight', this.sHeight);
    // console.log('rWidth', rWidth);
    // console.log('rHeight', rHeight);
    // console.log('uvCoeff', uvCoeff);

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

    canvas.style.left = `-${leftCanvasOffset}px`;
    canvas.style.bottom = `-${bottomCanvasOffset}px`;
    canvas.style.width = `${rWidth}px`;
    canvas.style.height = `${rHeight}px`;

    window.dispatchEvent(new CustomEvent('custom-resize', { 
      detail: { 
        sWidth: this.sWidth,
        sHeight: this.sHeight,
        rWidth,
        rHeight,
        uvCoeff 
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