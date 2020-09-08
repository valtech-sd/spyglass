AFRAME.registerComponent('mask', {
  init: function() {
    this.el.components.material.colorWrite = false
  }
})

AFRAME.registerComponent("webcam-overlay-helper", {
  schema: {
    blurAmount: {
      type: 'number',
      default: 1.5
    }
  },

  init: function( ){
    this.scene = document.querySelector('a-scene');
    this.resolution = new THREE.Vector2(1,1);

    this.isDirty = true
    this.textureSet = false

    let self = this

    // TODO: Why is this called all of the time?
    window.addEventListener('resize', function() {
      self.updateResolution()
    });

    let blurAmount = new THREE.Vector2(this.data.blurAmount, this.data.blurAmount);
    this.el.setAttribute('material', 'blurAmount', blurAmount);
  },
  // We need to update the resolution to pass to the blur function
  // in our shader
  updateResolution: function() {

    let rendererSize = new THREE.Vector2()
    this.scene.renderer.getSize(rendererSize)

    let sWidth = rendererSize.width
    let sHeight = rendererSize.height

    // We shouldn't have to do this if this is only called on resize...
    // But trying to avoid triggering a constant update on the attributes
    if (Math.abs(this.resolution.x - sWidth) + Math.abs(this.resolution.y - sHeight) > 0) {
      this.isDirty = true
      this.resolution.set(sWidth, sHeight);
    }
  },
  tick: function() {

    // If we haven't yet set the material, look up the
    // arjs video element and pass it through to the shader
    var webcamEl = document.getElementById("arjs-video");

    // TODO: We should check if the video is ready to play too
    // Right now we get some warnings before the video loads
    if (webcamEl && !this.textureSet) {
      this.el.setAttribute('material', 'map', '#arjs-video');
      this.textureSet = true
    }

    // If the screen resolution has been updated, update the shader uniform
    if (this.isDirty) {
      this.el.setAttribute('material', 'resolution', this.resolution);
      this.isDirty = false
    }
  }
});

AFRAME.registerShader('gaussian-blur', {
  schema: {
    map: {type: 'map', is: 'uniform'},
    resolution: {type: 'vec2', is: 'uniform'},
    blurAmount: {type: 'vec2', is: 'uniform'}
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
      gl_FragColor = blur13(map, vUv, resolution, blurAmount);
}
`
});