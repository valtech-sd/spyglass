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
})({"ZFDM":[function(require,module,exports) {
function ready(fn) {
  // replaces $(document).ready() in jQuery
  if (document.readyState != 'loading') {
    setTimeout(fn, 1000);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(fn, 1000);
    });
  }
}

ready(function () {
  console.log("DOM loaded"); // some test content

  let forYouType = "text-paragraph-bar"; // let forYouType = "numbered-text";

  let forYouData = [{
    title: "CONSERVE AND SAVE",
    body: "You've used Serum for 3 weeks with smoother skin? Consider increasing your concentration from 2% to 5% to increase cell turnover at an even faster rate.",
    type: forYouType
  }, {
    title: "STAY COOL",
    body: "The UV index is super high today in your area! Make sure to apply sunscreen throughout the day after using this serum.",
    type: forYouType
  }];
  let usageType = "textwithicon";
  let usageData = [{
    icon: "#step1",
    title: null,
    body: "Cleanse and tone head and neck.",
    type: usageType
  }, {
    icon: "#step2",
    title: null,
    body: "Measure out 1/2 teaspoon of serum.",
    type: usageType
  }, {
    icon: "#step3",
    title: null,
    body: "Massage into skin twice daily.",
    type: usageType
  }];
  let benefitsType = "textwithicon";
  let benefitsData = [{
    icon: "#ylangylang",
    title: "YLANG YLANG",
    body: "Sweet, exotic and floral, essential oil distilled from the fragrant flowers..",
    type: benefitsType
  }, {
    icon: "#panthenol",
    title: "PANTHENOL",
    body: "Also called B5 Vitamin, moisturizes the skin.",
    type: benefitsType
  }]; // This is a duplicated helper that should be consolidated!

  let makePanel = function (data) {
    // Build content panels with "data"
    var panel = document.createElement('a-entity');
    panel.setAttribute("content-group", "");
    let content = panel.components['content-group'];
    content.initializeFromData(data);
    return panel;
  };

  let $contentFan = document.getElementById("contentFan");
  let contentFan = $contentFan.components.contentfan;
  let $tabMenu = document.getElementById('tab-menu');
  let $reviewContent = document.getElementById('review-content'); // menu and text

  let $productContent = document.getElementById('product-content');
  let $reviewMenu = document.getElementById('review-product-menu'); // These are out of order bc I'm bad: 3 1 2

  contentFan.buildWithContentElements([makePanel(benefitsData), makePanel(forYouData), makePanel(usageData)]);
  var anchorRef = document.getElementById('twistParent');
  var mainMarkerRef = document.getElementById('mainMarker'); // Get reference to menu confirm

  $reviewMenu.addEventListener('tab-confirm', e => {
    // your code here}
    // Hide review menu
    // Remove marker tracker from review content
    $reviewContent.removeAttribute("marker-tracker");
    $reviewContent.object3D.visible = false; // Once we've reviewed the product, add the component to our content so it's trackable"

    $productContent.setAttribute("marker-tracker", "isPromiscuous: true; lossThreshold: 3000;");
  });
  mainMarkerRef.addEventListener("tilt-side", e => {
    // your code here}
    $reviewMenu.components["tab-menu"].incrementSelectedIndex();
  });
  mainMarkerRef.addEventListener("tilt-forward", e => {
    // your code here}
    $reviewMenu.components["tab-menu"].confirmSelectedIndex();
  });
  anchorRef.addEventListener("tag-index-trigger", e => {
    // your code here}
    let index = e.detail.index;
    $tabMenu.components["tab-menu"].selectIndex(index);
    contentFan.animateToContent(index);
  });
});
},{}]},{},["ZFDM"], null)
//# sourceMappingURL=scenario3.40323e40.js.map