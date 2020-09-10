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
})({"fpJy":[function(require,module,exports) {
module.exports = "din_ot.c8d0a8dc.png";
},{}],"LdJP":[function(require,module,exports) {
module.exports = "din_ot.4349e6fc.fnt";
},{}],"GTpC":[function(require,module,exports) {
"use strict";

var _din_ot = _interopRequireDefault(require("./assets/din_ot.png"));

var _din_ot2 = _interopRequireDefault(require("./assets/din_ot.fnt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Also have to do the icons?
function ready(fn) {
  // replaces $(document).ready() in jQuery
  if (document.readyState != 'loading') {
    setTimeout(fn, 3000);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(fn, 3000);
    });
  }
}

ready(function () {
  console.log("DOM loaded");
  var sceneRef = document.querySelector('a-scene'); // <a-entity content-group position="-3 5.5 -50">
  //   <a-entity textwithicon position="0 0 0"></a-entity>
  //   <a-entity textwithicon position="0 0 0"></a-entity>
  // </a-entity>
  // Test data

  let usageData = [{
    icon: "#step1",
    title: null,
    body: "Cleanse and tone head and neck."
  }, {
    icon: "#step2",
    title: null,
    body: "Measure out 1/2 teaspoon of serum."
  }, {
    icon: "#step3",
    title: null,
    body: "Massage into skin twice daily."
  }];
  let benefitsData = [{
    icon: "#ylangylang",
    title: "YLANG YLANG",
    body: "Sweet, exotic and floral, essential oil distilled from the fragrant flowers.."
  }, {
    icon: "#panthenol",
    title: "PANTHENOL",
    body: "Also called B5 Vitamin, moisturizes the skin."
  }];

  let makePanel = function (data) {
    // Build content panels with "data"
    var panel = document.createElement('a-entity');
    panel.setAttribute("content-group", "");
    let content = panel.components['content-group'];
    content.initializeFromData(data);
    return panel;
  }; // Build content panels with "data"


  var usagePanel = makePanel(usageData);
  var benefitsPanel = makePanel(benefitsData);
  var benefitsPanel2 = makePanel(benefitsData); // Provide content panel with an array of objects

  var anchorRef = document.getElementById('twistParent');
  var tabMenuRef = document.getElementById('tab-menu');
  var contentFanRef = document.getElementById("contentFan");
  let contentContainerRef = document.getElementById("container");
  let contentFan = contentFanRef.components.contentfan; // Add content to content fan
  // At some point we can find a better way to sync this w/the tab menu

  contentFan.buildWithContentElements([benefitsPanel, usagePanel, benefitsPanel2]); // console.log(anchorRef);
  // Update our content fan if we've detected a new tag

  anchorRef.addEventListener("tag-index-trigger", e => {
    // your code here}
    let index = e.detail.index;
    console.log("tag index triggered! ", index);
    tabMenuRef.components["tab-menu"].selectIndex(index);
    let animator = contentFanRef.components["contentfan"];
    animator.animateToContent(index);
  });
  anchorRef.addEventListener("tag-rotation", e => {
    // your code here}
    let tracker = contentContainerRef.components["smoothed-marker-tracker"];
    tracker.onMarkerRotationUpdate(e);
  });
  anchorRef.addEventListener("tag-position", e => {
    // your code here}
    let tracker = contentContainerRef.components["smoothed-marker-tracker"];
    tracker.onMarkerPositionUpdate(e);
  });
  anchorRef.addEventListener("tracking-started", e => {
    // your code here}
    console.log("tracking started");
    let tracker = contentContainerRef.components["smoothed-marker-tracker"];
    tracker.onMarkerTrackingStarted(e); // animator.animateContentOffset()
    // animator.animateContentOffset(offset)
  });
  anchorRef.addEventListener("tracking-ended", e => {
    // your code here}
    console.log("tracking ended");
    let tracker = contentContainerRef.components["smoothed-marker-tracker"];
    tracker.onMarkerTrackingEnded(e); // animator.animateContentOffset()
    // animator.animateContentOffset(offset)
  }); // Wiggle our content fan if the current tag has been rotated slightly
  // anchorRef.addEventListener("tag-rotation", (e)=>{ // your code here}
  //   // let index = e.detail.index
  //   // let offset = e.detail.normalizedRotation
  //   // let animator = contentFanRef.components["content-fan"]
  //
  //   // animator.animateContentOffset(offset)
  // })
});
},{"./assets/din_ot.png":"fpJy","./assets/din_ot.fnt":"LdJP"}]},{},["GTpC"], null)
//# sourceMappingURL=scenario2.09757496.js.map