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
})({"k6zh":[function(require,module,exports) {
// Register custom components before loading HTML
// TODO: This should actually be a combo of a component and a system...!
// We shouldn't do all the math in the component
AFRAME.registerComponent('tab-menu', {
  schema: {
    tabSpacing: {
      type: 'number',
      default: 4.25
    }
  },
  init: function () {
    this.tabElements = this.el.querySelectorAll('[tabitem], [icon-tab-menu-item]');
    this.tabComponents = [];
    this.spacing = this.data.tabSpacing;
    this.confirmedSelection = false;
    this.selectedIndex = 0;
    let self = this; // Fetch components

    this.tabElements.forEach(function (tag, index) {
      let textTab = tag.components['tabitem'];
      let iconTab = tag.components['icon-tab-menu-item'];
      let tabComponent = textTab ? textTab : iconTab;
      self.tabComponents.push(tabComponent);
    });
    this.tabComponents.forEach(function (tabComponent, index) {
      let tabWidth = tabComponent.getWidth(); // console.log(tabComponent)

      tabComponent.el.object3D.position.x = tabWidth * 0.5 + index * self.data.tabSpacing;

      if (index == self.selectedIndex) {
        tabComponent.select();
      } else {
        tabComponent.deselect();
      }
    });
  },
  selectIndex: function (index) {
    // If we've already confirmed, don't allow changing selection!
    if (this.confirmedSelection) {
      return;
    }

    let self = this;
    this.tabComponents.forEach(function (tabComponent, i) {
      // let tabComponent = tabEl.components.tabitem
      if (i == index) {
        self.selectedIndex = index;
        tabComponent.select();
        console.log("selecting", index);
      } else {
        tabComponent.deselect();
      }
    });
  },
  confirmIndex: function (index) {
    if (this.tabComponents.length > 0) {
      if (index >= 0 && index < this.tabComponents.length) {
        this.tabComponents[index].confirm();
        this.confirmedSelection = true; // This should match confirmation animation duration (or a lil longer)

        let self = this;
        setTimeout(function () {
          self.el.emit('tab-confirm');
        }, 1000);
      }
    }
  },
  incrementSelectedIndex: function () {
    let numTabs = this.tabComponents.length;

    if (numTabs > 0) {
      let indexToSelect = (this.selectedIndex + 1) % numTabs;
      this.selectIndex(indexToSelect);
    }
  },
  decrementSelectedIndex: function () {
    let numTabs = this.tabComponents.length;

    if (numTabs > 0) {
      let indexToSelect = this.selectedIndex == 0 ? numTabs - 1 : (this.selectedIndex - 1) % numTabs;
      this.selectIndex(indexToSelect);
    }
  },
  confirmSelectedIndex: function () {
    this.confirmIndex(this.selectedIndex);
  },
  update: function () {},
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});
},{}]},{},["k6zh"], null)
//# sourceMappingURL=../tab-menu.41f7b7c1.js.map