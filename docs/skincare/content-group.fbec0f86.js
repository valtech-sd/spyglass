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
})({"Poyw":[function(require,module,exports) {
// Register custom components before loading HTML
// TODO: This should actually be a combo of a component and a system...!
// We shouldn't do all the math in the component
AFRAME.registerComponent('content-group', {
  schema: {
    contentSpacing: {
      type: 'number',
      default: 1
    }
  },
  init: function () {
    this.spacing = this.data.contentSpacing;
  },
  initLayout: function () {
    // this.contentElements = this.el.querySelectorAll('[content-type]');
    this.contentElements = this.el.querySelectorAll('[textwithicon], [numbered-text], [text-paragraph-bar]');
    let self = this;
    var contentHeightSoFar = 0;
    this.contentElements.forEach(function (el, index) {
      // Unsure why it wasn't working the other way...with content type
      // AHHHHH.
      // don't hold this against me
      let contentComponent = el.components["textwithicon"];
      let contentHeight = 8;

      if (contentComponent == undefined) {
        contentComponent = el.components["numbered-text"];
        contentHeight = 4;
      }

      if (contentComponent == undefined) {
        contentComponent = el.components["text-paragraph-bar"];
        contentHeight = 8;
      } // let contentHeight = contentComponent.getHeight();


      el.object3D.position.y = contentHeightSoFar; // Content grows down
      // contentHeightSoFar += -self.spacing - contentHeight;

      contentHeightSoFar += -contentHeight; // console.log("content height so far: ", contentHeightSoFar);
    });
  },

  // TODO: Have some smarter way of adding data
  initializeFromData(data) {
    let self = this;
    data.forEach(function (content) {
      let hasTitle = content.title != null; // Create a content element

      var contentEl = document.createElement('a-entity');
      contentEl.setAttribute("content-type", {
        contentType: content.type
      }); // This could be better

      switch (content.type) {
        case "numbered-text":
          console.log("Adding numbered text");
          contentEl.setAttribute(content.type, {
            titleLabel: content.title,
            bodyLabel: content.body
          });
          break;

        case "textwithicon":
          console.log("adding text with icon");
          contentEl.setAttribute(content.type, {
            hasTitle: hasTitle,
            icon: content.icon,
            titleLabel: content.title,
            bodyLabel: content.body
          });
          break;

        case "text-paragraph-bar":
          console.log("adding text with bar");
          contentEl.setAttribute(content.type, {
            titleLabel: content.title,
            bodyLabel: content.body
          });
          break;

        default:
          break;
      }

      self.el.appendChild(contentEl);
    });
    this.initLayout();
  },

  update: function () {},
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});
},{}]},{},["Poyw"], null)
//# sourceMappingURL=content-group.fbec0f86.js.map