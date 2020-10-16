AFRAME.registerComponent('mask', {
  init: function() {
    this.el.components.material.colorWrite = false
    this.el.components.material.blending = "subtractive"
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
    this.resolution = new THREE.Vector2();


    window.addEventListener('custom-resize', e => {
      this.updateResolution(e.detail)
    });

    window.addEventListener('webcam-ready', () => {
      this.setMaterialAttrs();
    });

    window.plane = this;

  },

  setMaterialAttrs: function () {

    const blurAmount = new THREE.Vector2(this.data.blurAmount, this.data.blurAmount);
    this.el.setAttribute('material', 'blurAmount', blurAmount);
    this.el.setAttribute('material', 'tintAmount', this.data.tintAmount);
    this.el.setAttribute('material', 'map', '#arjs-video');

  },

  // We need to update the resolution to pass to the blur function
  // in our shader
  updateResolution: function({ sWidth, sHeight, rWidth, rHeight, uvAspect }) {

    this.resolution.set(sWidth, sHeight);
    this.el.setAttribute('material', 'resolution', this.resolution);
    this.el.setAttribute('material', 'uvAspect', uvAspect);

  }
});

AFRAME.registerShader('gaussian-blur', {
  schema: {
    map: {type: 'map', is: 'uniform'},
    resolution: {type: 'vec2', is: 'uniform'},
    uvAspect: {type: 'float', is: 'uniform'},
    blurAmount: {type: 'vec2', is: 'uniform'},
    tintAmount: {type: 'float', is: 'uniform'}
  },

  //TODO: Is there a way we can load these from glsl files`?
  vertexShader: `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4( position.xy , 1.0 , 1.0 );
}
`,
  fragmentShader: `
varying vec2 vUv;
uniform sampler2D map;
uniform vec2 resolution;
uniform float uvAspect;
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

      vec2 adjustedUV = vUv;
      // adjustedUV.x *= uvAspect;
      // adjustedUV.x += (1.0 - uvAspect) * 0.5;
      // Blur our pixels!
      vec4 blurredColor = blur13(map, adjustedUV, resolution, blurAmount);
      
      vec4 tintedColor = mix(blurredColor, vec4(0,0,0,1.), tintAmount);
      
      // Mix with object color
      gl_FragColor = tintedColor;
}
`
});