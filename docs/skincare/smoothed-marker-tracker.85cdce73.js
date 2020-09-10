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
})({"XbfR":[function(require,module,exports) {
// This component flips the coordinate frame of an object as a convenience
// It's mostly used to transform marker rotation to the rotation we perceive onscreen
// (Instead of being Y-up oriented)
AFRAME.registerComponent('smoothed-marker-tracker', {
  schema: {
    adjustedRotation: {
      type: 'vec3',
      default: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  },
  init: function () {
    this.el.object3D.isShown = false; // Add animations for events

    this.el.setAttribute("animation__show", "property: opacity; from: 0.0; to: 1.0; dur: 500; startEvents: onShow; easing: easeOutCubic;");
    this.el.setAttribute("animation__hide", "property: opacity; from: 1.0; to: 0.0; dur: 500; startEvents: onHide; easing: easeOutCubic;");
  },
  onMarkerPositionUpdate: function (event) {// console.log("position update")
  },
  onMarkerRotationUpdate: function (event) {// console.log("rot update")
  },
  onMarkerTrackingStarted: function (event) {
    // console.log("tracking update")
    // this.el.object3D.isShown = true
    this.el.object3D.visible = true; // this.el.emit('onShow', {}, true);
  },
  onMarkerTrackingEnded: function (event) {
    console.log("tracking update");
    this.el.object3D.visible = false; // this.el.object3D.isShown = false
    // this.el.emit('onHide', {}, true);
  },
  update: function () {},
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});
},{}]},{},["XbfR"], null)
//# sourceMappingURL=smoothed-marker-tracker.85cdce73.js.map