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
})({"pLOR":[function(require,module,exports) {
// Register custom components before loading HTML
// TODO: This should actually be a combo of a component and a system...!
// We shouldn't do all the math in the component
AFRAME.registerComponent('tabitem', {
  schema: {
    iconImage: {
      type: 'string',
      default: '#benefits'
    },
    textLabel: {
      type: 'string',
      default: 'hello'
    },
    textStyle: {
      type: 'string',
      default: 'hello'
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
    icon.setAttribute("animation__1", "property: opacity; from: 0.4; to: 1.0; dur: 300; startEvents: onSelect; easing: easeOutCubic;");
    icon.setAttribute("animation__2", "property: opacity; from: 1.0; to: 0.4; dur: 300; startEvents: onDeselect; easing: easeOutCubic;");
    this.el.appendChild(icon);
    var text = document.createElement('a-text');
    text.setAttribute('mixin', "menu-text");
    text.setAttribute('value', this.data.textLabel);
    text.setAttribute('position', '0 -1.65 0');
    text.setAttribute("animation__1", "property: opacity; from: 0.0; to: 1.0; dur: 300; startEvents: onSelect; easing: easeOutCubic;");
    text.setAttribute("animation__2", "property: opacity; from: 1.0; to: 0.0; dur: 300; startEvents: onDeselect; easing: easeOutCubic;");
    this.el.appendChild(text); // Compute width
    // TODO: Also include text size
    // let textAttr = text.components.value
    //
    // let textWidth = text.getAttribute("value")
    //   //.data.length
    //   //* (textAttr.data.width / textAttr.data.wrapCount);
    // this.width = Math.max(icon.getAttribute("width"), textWidth);

    this.width = icon.getAttribute("width");
    this.text = text;
    this.icon = icon;
  },
  onTabSelected: function (data) {
    console.log("on tab selected", data.detail.tabName);

    if (data.detail.tabName) {
      if (data.detail.tabName === this.data.textLabel) {
        this.select();
      } else {
        this.deselect();
      }
    }
  },
  getWidth: function () {
    console.log("width is ", this.width);
    return this.width;
  },
  select: function () {
    if (!this.isSelected) {
      this.isSelected = true;
      this.icon.emit('onSelect', {}, true);
      this.text.emit('onSelect', {}, true);
    }
  },
  deselect: function () {
    if (this.isSelected) {
      this.isSelected = false;
      this.text.emit('onDeselect', {}, true);
      this.icon.emit('onDeselect', {}, true);
    }
  },
  update: function () {},
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});
},{}]},{},["pLOR"], null)
//# sourceMappingURL=tab-menu-item.3f00ecbc.js.map