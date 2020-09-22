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
})({"mG4y":[function(require,module,exports) {
// Register custom components before loading HTML
// TODO: This should actually be a combo of a component and a system...!
// We shouldn't do all the math in the component
AFRAME.registerComponent('icon-tab-menu-item', {
  schema: {
    iconImage: {
      type: 'string',
      default: '#benefits'
    },
    isSelected: {
      type: 'boolean',
      default: true
    }
  },
  init: function () {
    this.isSelected = this.data.isSelected;
    var icon = document.createElement('a-image');
    icon.setAttribute("src", this.data.iconImage);
    icon.setAttribute("width", 2);
    icon.setAttribute("height", 2);
    icon.setAttribute("side", "front");
    icon.setAttribute("animation__1", "property: opacity; from: 0.4; to: 1.0; dur: 300; startEvents: onSelect; easing: easeOutCubic;");
    icon.setAttribute("animation__2", "property: opacity; from: 1.0; to: 0.4; dur: 300; startEvents: onDeselect; easing: easeOutCubic;");
    icon.setAttribute("animation__3", "property: color; from: #FFF; to: #74fab9; dur: 500; startEvents: onConfirm; easing: easeOutCubic;");
    this.el.appendChild(icon);
    var underline = document.createElement('a-plane');
    underline.setAttribute("width", 1.5);
    underline.setAttribute("height", 0.25);
    underline.setAttribute("position", "0.0 -1.5 0");
    underline.setAttribute("animation__1", "property: opacity; from: 0.0; to: 1.0; dur: 300; startEvents: onSelect; easing: easeOutCubic;");
    underline.setAttribute("animation__2", "property: opacity; from: 1.0; to: 0.0; dur: 300; startEvents: onDeselect; easing: easeOutCubic;"); //We should technically reset this confirm color when we're done...but we're only going to do it once

    underline.setAttribute("animation__3", "property: color; from: #FFF; to: #74fab9; dur: 500; startEvents: onConfirm; easing: easeOutCubic;");
    this.el.appendChild(underline);
    this.underline = underline;
    this.icon = icon;

    if (this.isSelected) {
      underline.setAttribute("opacity", 1.0);
      icon.setAttribute("opacity", 1.0);
    } else {
      underline.setAttribute("opacity", 0);
      icon.setAttribute("opacity", 0.4);
    }

    this.width = icon.getAttribute("width");
  },
  getWidth: function () {
    console.log("width is ", this.width);
    return this.width;
  },
  select: function () {
    if (!this.isSelected) {
      this.isSelected = true;
      this.icon.emit('onSelect', {}, true);
      this.underline.emit('onSelect', {}, true);
    }
  },
  deselect: function () {
    if (this.isSelected) {
      this.isSelected = false;
      this.icon.emit('onDeselect', {}, true);
      this.underline.emit('onDeselect', {}, true);
    }
  },
  confirm: function () {
    // Must be selected
    if (this.isSelected) {
      this.icon.emit('onConfirm', {}, true);
      this.underline.emit('onConfirm', {}, true);
    }
  },
  update: function () {},
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});
},{}]},{},["mG4y"], null)
//# sourceMappingURL=icon-tab-menu-item.998a0e39.js.map