// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"J0VN":[function(require,module,exports) {
AFRAME.registerComponent('mask', {
  init: function () {
    this.el.components.material.colorWrite = false;
    this.el.components.material.blending = "subtractive"; //this.el.object3D.renderOrder = 300;
    // this.el.components.material.c
  }
});
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
  init: function () {
    this.scene = document.querySelector('a-scene');
    this.resolution = new THREE.Vector2(1, 1);
    this.isDirty = true;
    this.textureSet = false;
    let self = this; // TODO: Why is this called all of the time?

    window.addEventListener('resize', function () {
      self.updateResolution();
    });
    let blurAmount = new THREE.Vector2(this.data.blurAmount, this.data.blurAmount);
    this.el.setAttribute('material', 'blurAmount', blurAmount);
    this.el.setAttribute('material', 'tintAmount', this.data.tintAmount);
    this.updateResolution();
  },
  // We need to update the resolution to pass to the blur function
  // in our shader
  updateResolution: function () {
    let rendererSize = new THREE.Vector2();
    this.scene.renderer.getSize(rendererSize);
    let sWidth = rendererSize.width;
    let sHeight = rendererSize.height;
    var w = window.innerWidth;
    var h = window.innerHeight; // console.log("renderer size")
    // console.log(rendererSize)
    //
    // console.log("window")
    // console.log(w)
    // console.log(h)

    let deltaX = (rendererSize.x - w) * 0.5;
    let offsetX = deltaX / rendererSize.x; // We shouldn't have to do this if this is only called on resize...
    // But trying to avoid triggering a constant update on the attributes

    if (Math.abs(this.resolution.x - sWidth) + Math.abs(this.resolution.y - sHeight) > 0) {
      this.isDirty = true;
      this.resolution.set(sWidth, sHeight);
    }
  },
  tick: function () {
    // If we haven't yet set the material, look up the
    // arjs video element and pass it through to the shader
    var webcamEl = document.getElementById("arjs-video"); // TODO: We should check if the video is ready to play too
    // Right now we get some warnings before the video loads

    if (webcamEl && !this.textureSet) {
      let rendererSize = new THREE.Vector2();
      this.scene.renderer.getSize(rendererSize);
      let sWidth = rendererSize.width;
      let sHeight = rendererSize.height;
      var w = window.innerWidth;
      var h = window.innerHeight; // console.log("renderer size")
      // console.log(rendererSize)
      //
      // console.log("window")
      // console.log(w)
      // console.log(h)

      let deltaX = (rendererSize.x - w) * 0.5;
      let offsetX = deltaX / rendererSize.x;
      let deltaY = (rendererSize.y - h) * 0.5;
      let offsetY = deltaY / rendererSize.y;
      this.el.setAttribute('material', 'offset', new THREE.Vector2(offsetX, offsetY));
      this.el.setAttribute('material', 'map', '#arjs-video');
      this.textureSet = true;
    } // If the screen resolution has been updated, update the shader uniform


    if (this.isDirty) {
      this.el.setAttribute('material', 'resolution', this.resolution);
      this.isDirty = false;
    }
  }
});
AFRAME.registerShader('gaussian-blur', {
  schema: {
    map: {
      type: 'map',
      is: 'uniform'
    },
    resolution: {
      type: 'vec2',
      is: 'uniform'
    },
    blurAmount: {
      type: 'vec2',
      is: 'uniform'
    },
    tintAmount: {
      type: 'float',
      is: 'uniform'
    }
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
},{}]},{},["J0VN"], null)
//# sourceMappingURL=../webcam-overlay.7a80f8a3.js.map