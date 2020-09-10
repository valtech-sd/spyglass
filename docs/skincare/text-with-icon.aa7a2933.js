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
})({"EewT":[function(require,module,exports) {
AFRAME.registerComponent('textwithicon', {
  schema: {
    hasTitle: {
      type: 'boolean',
      default: true
    },
    icon: {
      type: 'string',
      default: '#benefits'
    },
    titleLabel: {
      type: 'string',
      default: 'YLANG YLANG'
    },
    bodyLabel: {
      type: 'string',
      default: "Sweet, exotic and floral, essential oil distilled from the fragrant flowers."
    }
  },
  init: function () {
    // For now, it's a circle
    var icon = document.createElement('a-circle');
    icon.setAttribute("color", "#74fab9");
    icon.setAttribute("radius", 1.5);
    icon.setAttribute("segments", 128);
    icon.setAttribute("opacity", 1.0);
    icon.setAttribute("position", "1 0 0");
    this.el.appendChild(icon); // Add a circle

    if (this.data.icon != "") {
      let iconImage = document.createElement('a-image');
      iconImage.setAttribute("src", this.data.icon);
      iconImage.setAttribute("opacity", 1.0);
      iconImage.setAttribute("scale", "2 2 2");
      iconImage.setAttribute("color", "black");
      iconImage.setAttribute("position", "0 0 1");
      icon.appendChild(iconImage);
    }

    this.icon = icon;
    let textContainer = document.createElement('a-entity');
    textContainer.setAttribute('position', "0 -2.25 0");
    this.el.appendChild(textContainer);
    this.textContainer = textContainer;

    if (this.data.hasTitle) {
      var title = document.createElement('a-text');
      title.setAttribute('mixin', "body-text");
      title.setAttribute('value', this.data.titleLabel);
      title.setAttribute('position', '0 0 0');
      this.textContainer.appendChild(title);
      this.title = title;
    }

    var body = document.createElement('a-text');
    body.setAttribute('mixin', "body-text");
    body.setAttribute('value', this.data.bodyLabel);

    if (this.data.hasTitle) {
      body.setAttribute('position', '0 -1 0');
    } else {
      body.setAttribute('position', '0 0 0');
    }

    this.textContainer.appendChild(body);
    this.body = body; // Compute width
    // TODO: Also include text size
    // let textAttr = text.components.value
    //
    // let textWidth = text.getAttribute("value")
    //   //.data.length
    //   //* (textAttr.data.width / textAttr.data.wrapCount);
    // this.width = Math.max(icon.getAttribute("width"), textWidth);
    // this.width = icon.getAttribute("width")
  },
  // getWidth: function() {
  //   console.log("width is ", this.width);
  //   return this.width;
  // },
  getHeight: function () {
    // Get height of body text
    // TODO: Replace 2.25 with icon height + spacing
    var h = 2.25 + 5; //+ this.body.height;
    // let bodyText = this.body.components.text
    // let bodyHeight = this.body.getAttribute("height");
    // console.log("body");
    // console.log(this.body);
    // bodyText.updateLayout();
    //
    // console.log("geo")
    // console.log(bodyText.geometry)
    // console.log(bodyText.geometry.height)
    // // console.log(this.body.components.text);
    // console.log(bodyText.data);

    if (this.hasTitle) {
      // h += this.title.height + 1;
      h += 1.5;
    } // console.log("height is " + h);
    // Fake number for now


    return h; // return 5;
  },
  configure: function (titleName, textBody, iconUrl) {},
  update: function () {},
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});
},{}]},{},["EewT"], null)
//# sourceMappingURL=text-with-icon.aa7a2933.js.map