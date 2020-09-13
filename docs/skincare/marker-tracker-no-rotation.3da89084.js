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
})({"vcWR":[function(require,module,exports) {
// This component flips the coordinate frame of an object as a convenience
// It's mostly used to transform marker rotation to the rotation we perceive onscreen
// (Instead of being Y-up oriented)
AFRAME.registerComponent('marker-tracker', {
  schema: {
    marker: {
      type: 'string',
      default: ""
    },
    visibilityOnly: {
      type: 'boolean',
      default: false
    },
    visibilityTrigger: {
      type: 'boolean',
      default: false
    },
    isPromiscuous: {
      type: 'boolean',
      default: false
    },
    lossThreshold: {
      type: 'number',
      default: 500
    }
  },
  init: function () {
    this.el.object3D.isShown = false;
    this.marker = this.data.marker;
    this.lossThreshold = this.data.lossThreshold;
    this.lossTime = null; // These could be settings

    this.constantZ = -10; // for promiscuous mode

    this.isPromiscuous = this.data.isPromiscuous;
    this.trackedMarkers = [];

    if (this.isPromiscuous) {
      let allMarkers = document.querySelectorAll('a-marker');
      this.trackedMarkers = allMarkers;
    } else if (this.marker !== "") {
      let markerElement = document.getElementById(this.marker);

      if (markerElement !== null) {
        this.trackedMarkers.push(markerElement);
        this.markerElement = markerElement;
      }
    }

    this.positionOffset = this.el.object3D.position.clone();
  },
  update: function () {},
  tick: function () {
    let isVisible = false;
    let positionToApply = null;
    let isMainMarker = false;
    let trackedIndex = null;
    this.trackedMarkers.forEach(function (markerElement, index) {
      if (markerElement.object3D.visible == true) {
        isVisible = true;
        this.lossTime = null; // AR.js doesn't properly use its "size" property, so we do it here instead:

        let size = markerElement.getAttribute("size");
        let scalarAmount = size;
        positionToApply = markerElement.object3D.position.clone().multiplyScalar(size);
        trackedIndex = index;
      }
    });

    if (positionToApply != null) {
      let origin = this.positionOffset.clone();
      let updatedPosition = this.el.object3D.position.clone();
      let positionChange = new THREE.Vector3(0, 0, 0);
      let markerPos = positionToApply;

      if (!this.data.visibilityOnly) {
        updatedPosition.x = origin.x + markerPos.x;
        updatedPosition.z = origin.z + markerPos.z; // Kind of a hack, but don't update y position since we printed
        // the markers at different height on our label

        if (trackedIndex == 0) {
          updatedPosition.y = origin.y + markerPos.y;
        }

        let smoothAmount = 0.3;
        let weightedCurrentPos = this.el.object3D.position.clone().multiplyScalar(smoothAmount);
        let weightedUpdatedPos = updatedPosition.clone().multiplyScalar(1.0 - smoothAmount);
        let smoothedResult = weightedCurrentPos.add(weightedUpdatedPos); // this.el.object3D.position.copy(updatedPosition);

        this.el.object3D.position.copy(smoothedResult);
      }
    } else {
      this.el.object3D.position = this.positionOffset.clone();
    }

    let exceededMarkerLossThreshold = false;

    if (!isVisible) {
      if (this.lossTime == null) {
        this.lossTime = Date.now();
      } else {
        let currentTime = Date.now();
        let delta = Math.abs(currentTime - this.lossTime);

        if (delta > this.lossThreshold) {
          exceededMarkerLossThreshold = true;
        }
      }
    } // If we're using the marker as a visibility trigger, show once we find a marker
    // Otherwise, don't hide unless we've exceeded our marker loss threshold in seconds


    if (isVisible) {
      this.lossTime = null;
      this.el.object3D.visible = true;
    } else if (!this.data.visibilityTrigger && exceededMarkerLossThreshold) {
      this.el.object3D.visible = false;
      this.lossTime = null;
    }
  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});
},{}]},{},["vcWR"], null)
//# sourceMappingURL=marker-tracker-no-rotation.3da89084.js.map