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
})({"JOOh":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const secrets = {
  apiKey: 'blte63f7056be4da683',
  environment: 'localhost-dev',
  deliveryToken: 'cs01d945711b0bb626d33ad776'
};
var _default = secrets;
exports.default = _default;
},{}],"tBe1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _secrets = _interopRequireDefault(require("../../samples/contentstack-integration/secrets"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const data_sources = {
  contentstack: {},
  personalized: {},
  getData: () => 0
};

async function getStackData() {
  const $export = document.querySelector('#cleaned_output');
  const GQL_URL = `https://graphql.contentstack.com/stacks/${_secrets.default.apiKey}?environment=${_secrets.default.environment}`;
  const GQL_HEADERS = {
    'Content-Type': 'application/json',
    'access_token': _secrets.default.deliveryToken
  };
  const gqlQuery = `{
    all_product(where: {product_line: "Serums"}) {
      items {
        title
        product_name
        brand
        product_line
        upc
        form
        amount {
          quantity
          measurement
        }
        packaging {
          type
        }
        rating
        additional_contraindications
        usage_frequencyConnection(limit:7) {
          edges {
            node {
              ... on UsageTimeTags {
                title
              }
            }
          }
        }
        marker_fileConnection(limit: 3) {
          edges {
            node {
              title
              url
            }
          }
        }
        product_imagesConnection(limit: 1) {
          edges {
            node {
              title
              url
            }
          }
        }
        instructions {
          step_instruction_text
        }
        ingredient_list {
          concentration
          ingredientsConnection {
            edges {
              node {
                ... on Ingredient {
                  title
                  name
                  also_known_as
                  description
                  imageConnection {
                    edges {
                      node {
                        title
                        url
                      }
                    }
                  }
                  contraindications
                }
              }
            }
          }
        }
      }
    }
  }`;

  function rearrangeAPIResponse(response) {
    var _response$data;

    let newData = {};

    if (response === null || response === void 0 ? void 0 : (_response$data = response.data) === null || _response$data === void 0 ? void 0 : _response$data.all_product) {
      newData = {
        'serums': [...response.data.all_product.items]
      };

      for (let i = 0; i < newData.serums.length; i++) {
        var _entry$additional_con;

        const entry = {
          // Add an id (What serum no. is it?)
          '_id': parseInt(newData.serums[i].product_name.split(' ')[2]),
          ...newData.serums[i]
        }; // Remove nesting of references
        // ✔️ contraindications (see ingredients below)

        entry.contraindications = [];

        if ((_entry$additional_con = entry.additional_contraindications) === null || _entry$additional_con === void 0 ? void 0 : _entry$additional_con.length) {
          entry.contraindications.push(entry.additional_contraindications);
        }

        delete entry.additional_contraindications; // ✔️ usage frequency

        entry.usage_frequency = entry.usage_frequencyConnection.edges.map(item => item.node.title);
        delete entry.usage_frequencyConnection; // ✔️ marker pattern

        entry.marker_patt_urls = entry.marker_fileConnection.edges.map(item => item.node.url);
        delete entry.marker_fileConnection; // ✔️ product image

        entry.product_image_urls = entry.product_imagesConnection.edges.map(item => item.node.url);
        delete entry.product_imagesConnection; // ✔️ ingredients

        entry.ingredients = entry.ingredient_list.map(item => {
          const ingredient_edges = item.ingredientsConnection.edges;

          if (ingredient_edges.length) {
            // There will only be one ingredient in the ingredientsConnection
            const n = {};
            n.name = ingredient_edges[0].node.name;
            n.also_known_as = ingredient_edges[0].node.also_known_as;

            if ('edges' in ingredient_edges[0].node.imageConnection && ingredient_edges[0].node.imageConnection.edges.length) {
              n.image_url = ingredient_edges[0].node.imageConnection.edges[0].node.url;
            }

            n.description = ingredient_edges[0].node.description;
            if (item.concentration) n.concentration = item.concentration; // Add the contraindications 

            if (ingredient_edges[0].node.contraindications) {
              entry.contraindications.push(ingredient_edges[0].node.contraindications);
            }

            return n;
          }
        });
        delete entry.ingredient_list; // simplify usage instructions

        entry.directions = entry.instructions.map(item => {
          return {
            text: item.step_instruction_text
          };
        });
        delete entry.instructions;
        newData.serums[i] = entry;
      }
    }

    console.log(newData); // Sort the serums

    newData.serums.sort((a, b) => a._id - b._id);
    return newData;
  } // Guidance here: https://graphql.org/learn/serving-over-http/#http-methods-headers-and-body


  const productsByGraphQL = await window.fetch(GQL_URL, {
    method: 'POST',
    headers: GQL_HEADERS,
    body: JSON.stringify({
      query: gqlQuery
    })
  }).then(response => response.json()).then(data => rearrangeAPIResponse(data));
  data_sources.contentstack = productsByGraphQL;
} // This data would be stored in another database.


data_sources.personalized = {
  other_product_images: {
    cleanser: 'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blt2768458962874adb/5f5d73c7ace172423d8845be/01_Cleanser_3.png',
    toner: 'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blt3b2f9c68cda139c8/5f5d73b82917074cd81a2925/02_Toner_3.png',
    moisturizer_empty: 'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blt879660a27aedbfec/5f5d73a665c9c14aec2fb9f7/04_Moisturizer_0.png',
    moisturizers: ['https://images.contentstack.io/v3/assets/blte63f7056be4da683/blta69fd32048fdecab/5f5d740674038f4956e098d8/04_Moisturizer_1.png', 'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blt7e0ba1616f10fbd1/5f5d85e42917074cd81a2929/04_Moisturizer_7.png'],
    sunscreen: 'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blt80ab90086435bebe/5f5d739883eade441b6a6ae8/05_Sunscreen_0.png'
  },
  serums: [{
    _id: 1,
    why: ['Your goal is anti-aging.', 'Better than leading competitors\' products.', 'Cheaper than leading competitors\' products.', 'Sweet floral fragrance!'],
    for_you: [{
      title: 'Conserve and save',
      text: 'You\'ve used Serum for 3 weeks with smoother skin? Consider increasing your concentration from 2% to 5% to increase cell turnover at an even faster rate.'
    }, {
      title: 'Shields up',
      text: 'The UV index is super high today in your area! Make sure to apply sunscreen throughout the day after using this serum.'
    }],
    ratings: {
      approval: 86,
      friends_who_like: 6,
      reviews: [{
        user: 'yourfriendjen',
        title: 'THE BEST SERUM OUT THERE',
        testimonial: '"This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even."'
      }]
    }
  }, {
    _id: 2,
    why: ['Your goal is moisturizing.', 'Better than leading competitors\' products.', 'Borage seed is a natural mellowing agent.', 'No allergens for you!'],
    for_you: [{
      title: 'Feeling drier?',
      text: 'Humidity forecasts are down for your location. Use a water-based solution to hydrate skin, then apply drops as needed.'
    }, {
      title: 'Relax naturally',
      text: 'If you’re feeling a bit stressed out, know that Borage Seed Oil also creates a natural calming effect.'
    }],
    ratings: {
      approval: 47,
      friends_who_like: 2,
      reviews: [{
        user: 'yourfriendjen',
        title: 'THE BEST SERUM OUT THERE',
        testimonial: '"This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even."'
      }]
    }
  }, {
    _id: 3,
    why: ['Your goal is smoother skin.', 'Better than leading competitors\' products.', 'Cheaper than leading competitors\' products.', 'No allergens for you!'],
    for_you: [{
      title: 'Next level',
      text: 'Need more moisturizer? See our site to learn how to add our face oils into your routine to better hydrate your skin…'
    }, {
      title: 'Shields up',
      text: 'The UV index is super high today in your area! Make sure to apply sunscreen throughout the day after using this serum.'
    }],
    ratings: {
      approval: 86,
      friends_who_like: 6,
      reviews: [{
        user: 'yourfriendjen',
        title: 'THE BEST SERUM OUT THERE',
        testimonial: '"This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even."'
      }]
    }
  }]
};
data_sources.getData = getStackData; // console.log('inside data_sources.js and ',data_sources);

var _default = data_sources;
exports.default = _default;
},{"../../samples/contentstack-integration/secrets":"JOOh"}],"ZFDM":[function(require,module,exports) {
"use strict";

var _data_sources = _interopRequireDefault(require("../js/data_sources"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

ready(async function () {
  console.log("DOM loaded");
  await _data_sources.default.getData();
  console.log(_data_sources.default);
  const forYouType = "text-paragraph-bar";
  const usageType = "textwithicon";
  const benefitsType = "textwithicon";
  let scenarioData = [];

  function generateContentFanData() {
    for (let i = 0; i < _data_sources.default.contentstack.serums.length; i++) {
      const csProduct = _data_sources.default.contentstack.serums[i];
      const localProduct = _data_sources.default.personalized.serums[i];
      const productData = {
        forYou: [],
        usage: [],
        benefits: []
      };

      for (let j = 0; j < localProduct.for_you.length; j++) {
        productData.forYou.push({
          title: localProduct.for_you[j].title.toUpperCase(),
          body: localProduct.for_you[j].text,
          type: forYouType
        });
      }

      for (let j = 0; j < csProduct.directions.length; j++) {
        productData.usage.push({
          icon: "#step" + (j + 1),
          title: null,
          body: csProduct.directions[j].text,
          type: usageType
        });
      }

      for (let j = 0; j < csProduct.ingredients.length && j < 2; j++) {
        productData.benefits.push({
          icon: '#' + csProduct.ingredients[j].name.toLowerCase().split(' ').join(''),
          title: csProduct.ingredients[j].name.toUpperCase(),
          body: csProduct.ingredients[j].description,
          type: benefitsType
        });
      }

      scenarioData.push(productData);
    }
  }

  generateContentFanData(); // This is a duplicated helper that should be consolidated!

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

  contentFan.buildWithContentElements([makePanel(scenarioData[0].benefits), makePanel(scenarioData[0].forYou), makePanel(scenarioData[0].usage)]);
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
},{"../js/data_sources":"tBe1"}]},{},["ZFDM"], null)
//# sourceMappingURL=scenario3.78d2ba0e.js.map