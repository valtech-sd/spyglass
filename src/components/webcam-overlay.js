AFRAME.registerComponent('mask', {
  init: function() {
    this.el.components.material.colorWrite = false
    this.el.components.material.blending = "subtractive"
    //this.el.object3D.renderOrder = 300;
    // this.el.components.material.c
  }
})

AFRAME.registerComponent("webcam-overlay-helper", {
  schema: {
    blurAmount: {
      type: 'number',
      default: 1.0
    },
    tintAmount: {
      type: 'number',
      default: 0.4
    }
  },

  init: function( ){
    this.scene = document.querySelector('a-scene');
    this.resolution = new THREE.Vector2();
    this.webcamEl = document.getElementById("arjs-video");

    this.textureSet = false;


    this.sWidth = window.innerWidth;
    this.sHeight = window.innerHeight;

    // Why is this called all of the time? bug in AR.js.
    // window.addEventListener('resize', () => {
    //   this.updateResolution()
    // });

    window.addEventListener('arjs-video-loaded', () => {

      console.log('arjs video loaded, textureSet', this.textureSet);

      const {x,y} = this.scene.renderer.getSize();

      let deltaX = (x - this.sWidth) * 0.5;
      let offsetX = deltaX / x;

      let deltaY = (y - this.sHeight) * 0.5;
      let offsetY = deltaY / y;

      this.el.setAttribute('material', 'offset', new THREE.Vector2(offsetX, offsetY));

      this.el.setAttribute('material', 'map', '#arjs-video');
      this.textureSet = true

      window.plane = this;
      
    })

    let blurAmount = new THREE.Vector2(this.data.blurAmount, this.data.blurAmount);
    this.el.setAttribute('material', 'blurAmount', blurAmount);
    this.el.setAttribute('material', 'tintAmount', this.data.tintAmount);

    this.updateResolution()
  },
  // We need to update the resolution to pass to the blur function
  // in our shader
  updateResolution: function() {

    console.log('update resolution');
    const dpr = this.scene.renderer.getPixelRatio();

    this.scene.renderer.setSize(this.sWidth, this.sHeight);
    this.resolution.set(this.sWidth, this.sHeight);
    this.el.setAttribute('material', 'resolution', this.resolution);

    // const { x, y } = this.scene.renderer.getSize();

    // if (this.resolution.x !== x || this.resolution.y !== y) {
    //   this.resolution.set(x, y);
      
    // }

  },
  tick: function() {

    // making a custom resize trigger in the tick as window resize event is called all the time
    if (this.sWidth !== window.innerWidth || this.sHeight !== window.innerHeight) {

      this.sWidth = window.innerWidth;
      this.sHeight = window.innerHeight;
      this.updateResolution();

    }

  }
});

AFRAME.registerShader('gaussian-blur', {
  schema: {
    map: {type: 'map', is: 'uniform'},
    resolution: {type: 'vec2', is: 'uniform'},
    blurAmount: {type: 'vec2', is: 'uniform'},
    tintAmount: {type: 'float', is: 'uniform'}
  },

  //TODO: Is there a way we can load these from glsl files`?
  vertexShader: `
varying vec2 vUv;
uniform vec2 resolution;

void main() {
  vUv = uv;
  
  // Default position of vertices
  // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  
  float res = resolution.y / resolution.x;
  
  vec2 pos = position.xy; 

  // TODO: Need to also crop however we do in browser 
  vec4 uSize = vec4(2.0, 2.0, -0.5, -0.5);
  
  // Borrowed from: https://github.com/pailhead/three-screen-quad/blob/master/ScreenQuad.es6.js
  vec2 transformed = pos * uSize.xy - vec2(1.,-1.) + vec2( uSize.x ,  -uSize.y ) + vec2( uSize.w , - uSize.z ) * 2.;

  gl_Position = vec4( transformed , 1. , 1. );
}
`,
  fragmentShader: `
varying vec2 vUv;
uniform sampler2D map;
uniform vec2 resolution;
uniform vec2 blurAmount;
uniform float tintAmount;

// Single-pass Gaussian blur
// Borrowed from: https://github.com/Jam3/glsl-fast-gaussian-blur
// TODO: Let's change this to 9 from 13
vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.411764705882353) * direction;
  vec2 off2 = vec2(3.2941176470588234) * direction;
  vec2 off3 = vec2(5.176470588235294) * direction;
  color += texture2D(image, uv) * 0.1964825501511404;
  color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
  color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
  return color;
}

void main() {
      // Blur our pixels!
      vec4 blurredColor = blur13(map, vUv, resolution, blurAmount);
      
      vec4 tintedColor = mix(blurredColor, vec4(0,0,0,1.), tintAmount);
      
      // Mix with object color
      gl_FragColor = tintedColor;
}
`
});