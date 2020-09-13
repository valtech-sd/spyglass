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
})({"ewd3":[function(require,module,exports) {
// Register custom components before loading HTML
// TODO: This should actually be a combo of a component and a system...!
// We shouldn't do all the math in the component
AFRAME.registerComponent('rotation-trigger', {
  schema: {
    tiltSideThreshold: {
      type: 'number',
      default: 1.1
    },
    tiltForwardThreshold: {
      type: 'number',
      default: 0.4
    },
    twistThreshold: {
      type: 'number',
      default: 2.0
    },
    // TODO: SET MIN / MAX
    smoothingFactor: {
      type: 'number',
      default: 0.5
    },
    debounceTime: {
      type: 'time',
      default: 1500
    }
  },
  init: function () {
    // Values used for internal calculation
    // TODO: How to just have these be set by the schema default?
    this.prevRotation = new THREE.Vector3(0, 0, 0);
    this.currRotationRate = new THREE.Vector3(0, 0, 0);
    this.prevTimestamp = -1; // Last time we detected each event time (for debouncing)

    this.lastTiltSide = -10000;
    this.lastTiltForward = -10000;
    this.lastTwist = -10000; // TODO: How to set to default?

    this.smoothingFactor = this.data.smoothingFactor; // Bind methods.js

    this.onTiltSide = AFRAME.utils.bind(this.onTiltSide, this);
    this.onTiltForward = AFRAME.utils.bind(this.onTiltForward, this);
    this.onTwist = AFRAME.utils.bind(this.onTwist, this); // Attach event listener.
    // We could do this outside of the component too

    this.el.addEventListener('tilt-forward', this.onTiltForward);
    this.el.addEventListener('tilt-side', this.onTiltSide);
    this.el.addEventListener('twist', this.onTwist);
    console.log("initializing marker thing");
  },
  onTiltSide: function () {// console.log("tilt side!")
  },
  onTiltForward: function () {// console.log("tilt forward!")
  },
  onTwist: function () {// console.log("Twist")
  },
  update: function () {},
  tick: function () {
    let entity = this.el.object3D;
    var radToDeg = THREE.Math.radToDeg; // Only calculate rotation when entity is visible

    if (entity.visible) {
      var transformAxisMatrix = new THREE.Matrix4();
      transformAxisMatrix.set(1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1); // Transform the marker's rotation axis so that it
      // matches the coordinate frame of the scene

      let adjustedRotation = entity.rotation.toVector3().applyMatrix4(transformAxisMatrix);
      let rotationDegrees = new THREE.Vector3(radToDeg(adjustedRotation.x), radToDeg(adjustedRotation.y), radToDeg(adjustedRotation.z)); // Get timestamp

      let currTimestamp = Date.now(); // convert to

      let deltaTimestamp = this.prevTimestamp == -1 ? 0 : Math.abs(currTimestamp - this.prevTimestamp); // Calculate rotation delta (z-axis)

      if (deltaTimestamp > 0) {
        let deltaTimestampVec = new THREE.Vector3().addScalar(deltaTimestamp);
        let smoothingFactorVec = new THREE.Vector3().addScalar(this.smoothingFactor); // Account for angle rollover (0-360)
        // If delta is way too big, adjust it

        let clampDelta = function (rawDelta) {
          if (rawDelta.x > 180) {
            rawDelta.x -= 360;
          } else if (rawDelta.x < -180) {
            rawDelta.x += 360;
          }

          if (rawDelta.y > 180) {
            rawDelta.y -= 360;
          } else if (rawDelta.y < -180) {
            rawDelta.y += 360;
          }

          if (rawDelta.z > 180) {
            rawDelta.z -= 360;
          } else if (rawDelta.z < -180) {
            rawDelta.z += 360;
          }

          return rawDelta;
        }; // We must use vec3 functions; operators are not overloaded...
        // THREE.js vec functions are also mutative, so clone if you don't
        // want to modify the original vector!!!


        let rawDelta = rotationDegrees.clone().sub(this.prevRotation);
        let rotationDelta = clampDelta(rawDelta);
        let rotationRate = rotationDelta.clone().divide(deltaTimestampVec).multiply(new THREE.Vector3(10, 10, 10)); // Smooth out the rate of rotation

        let weightedHistory = smoothingFactorVec.clone().multiply(this.currRotationRate);
        let weightedCurrent = new THREE.Vector3(1.0, 1.0, 1.0).sub(smoothingFactorVec).multiply(rotationRate);
        this.currRotationRate = weightedHistory.add(weightedCurrent);
        let currTime = Date.now(); //millis
        // Detect side tilt

        if (Math.abs(this.currRotationRate.z) >= this.data.tiltSideThreshold) {
          if (currTime - this.lastTiltSide > this.data.debounceTime) {
            this.lastTiltSide = currTime;
            this.el.emit("tilt-side");
          } else {// console.log("debounced")
          }
        } // Detect forward tilt
        // console.log(this.currRotationRate.x);


        if (Math.abs(this.currRotationRate.x) >= this.data.tiltForwardThreshold) {
          if (currTime - this.lastTiltForward > this.data.debounceTime) {
            this.lastTiltForward = currTime;
            this.el.emit("tilt-forward");
          } else {// console.log("debounced")
          }
        } // Detect twist
        // console.log(Math.abs(this.currRotationRate.y))
        // console.log(this.data.twistThreshold)


        if (Math.abs(this.currRotationRate.y) >= this.data.twistThreshold) {
          if (currTime - this.lastTwist > this.data.debounceTime) {
            this.lastTwist = currTime;
            this.el.emit("twist");
          } else {
            console.log("debounced");
          }
        }
      }

      this.prevTimestamp = currTimestamp; // console.log("setting prev to ", rotationDegrees)

      this.prevRotation = rotationDegrees; // this.prevRotation.set(rotationDegrees)
    } else {
      // Reset timestamp if entity is not visible
      this.prevTimestamp = -1; // this.prevRotation.set(0,0,0)

      this.currRotationRate.set(0, 0, 0);
    }
  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});
},{}]},{},["ewd3"], null)
//# sourceMappingURL=rotation-trigger.7deb647e.js.map