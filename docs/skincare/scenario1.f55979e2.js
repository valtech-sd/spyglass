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
  apiKey: "blte63f7056be4da683",
  environment: "localhost-dev",
  deliveryToken: "cs01d945711b0bb626d33ad776"
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
        testimonial: '"This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even."'
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
},{"../../samples/contentstack-integration/secrets":"JOOh"}],"WonQ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = data => {
  var _data$contentstack, _data$contentstack$se;

  /**
   * The job of this function is to:
   * go through the data, identify ingredient and product assets URLs,
   * return them in organized format
   * 
   * future work:
   * expand data response to include other assets, eg. videos, moisturizer images
   */
  const ingredientURLs = {};
  const productURLs = {};
  (_data$contentstack = data.contentstack) === null || _data$contentstack === void 0 ? void 0 : (_data$contentstack$se = _data$contentstack.serums) === null || _data$contentstack$se === void 0 ? void 0 : _data$contentstack$se.forEach(serum => {
    var _serum$ingredients;

    (_serum$ingredients = serum.ingredients) === null || _serum$ingredients === void 0 ? void 0 : _serum$ingredients.forEach(ingredient => {
      // remove white space and lowercase to create the dom id
      const domId = ingredient.name.replace(/ /g, '').toLowerCase(); // no duplicates

      if (ingredientURLs[domId] === undefined) {
        ingredientURLs[domId] = ingredient.image_url;
      } // perhaps we need to be more clever and check the also_known_as names

    });
    const productId = `serum${serum._id}`;

    if (serum.product_image_urls.length) {
      productURLs[productId] = serum.product_image_urls[0];
    }
  });
  return {
    ingredientURLs,
    productURLs
  };
};

exports.default = _default;
},{}],"QOCG":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const createAnchor = (href, text, classNames) => {
  const anchorEl = document.createElement('a');
  anchorEl.href = href;
  anchorEl.innerHTML = text;
  anchorEl.className = classNames;
  return anchorEl;
};

var _default = () => {
  // returns an array of nav links depending on the current page
  const navLinks = [];
  const allPages = {
    scenario1: 'IN STORE',
    scenario2: 'AT HOME',
    scenario3: 'LATER'
  };
  const pagesArray = Object.keys(allPages).sort();
  const homeText = ''; // get current route

  const splitPath = window.location.pathname.split('/');
  const routeIndex = splitPath.length - 2;
  const currRoute = splitPath[routeIndex];
  const pageIndex = pagesArray.indexOf(currRoute);

  if (!currRoute || pageIndex === -1) {
    // we are on the home page and already have our navlinks
    return navLinks;
  }

  const prevPage = pagesArray[pageIndex - 1];
  const nextPage = pagesArray[pageIndex + 1]; // add prev page link

  if (prevPage) {
    splitPath[routeIndex] = prevPage;
    const href = splitPath.join('/');
    const text = `&larr; ${allPages[prevPage]}`;
    const classNames = 'navlink navlink-left';
    navLinks.push(createAnchor(href, text, classNames));
  } // add next page link


  if (nextPage) {
    splitPath[routeIndex] = nextPage;
    const href = splitPath.join('/');
    const text = `${allPages[nextPage]} &rarr;`;
    const classNames = 'navlink navlink-right';
    navLinks.push(createAnchor(href, text, classNames));
  } // add home page link


  const homeSplit = splitPath.slice(0, routeIndex);
  const homeHref = homeSplit.length > 1 ? homeSplit.join('/') : '/';
  const classNames = 'navlink navlink-center';
  navLinks.push(createAnchor(homeHref, homeText, classNames));
  return navLinks;
};

exports.default = _default;
},{}],"Ony6":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = () => {
  const isTouchDevice = () => 'ontouchstart' in window || 'onmsgesturechange' in window;

  return window.screenX != 0 && !isTouchDevice() ? true : false;
};

exports.default = _default;
},{}],"ev72":[function(require,module,exports) {
"use strict";

var _data_sources = _interopRequireDefault(require("../js/data_sources"));

var _getAssetURLs = _interopRequireDefault(require("../utils/getAssetURLs"));

var _createNavLinks = _interopRequireDefault(require("../utils/createNavLinks"));

var _detectDesktop = _interopRequireDefault(require("../utils/detectDesktop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ready(fn) {
  // replaces $(document).ready() in jQuery
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(async () => {
  console.log('DOM is ready.'); // create nav links

  const main = document.querySelector('main');
  const navContainer = document.createElement('section');
  navContainer.className = 'nav-container';
  const navLinks = (0, _createNavLinks.default)();
  navLinks.forEach(navLink => navContainer.appendChild(navLink));
  main.appendChild(navContainer); // Wait for the Contentstack data to come back before proceeding!

  await _data_sources.default.getData(); // detect desktop and alert

  if ((0, _detectDesktop.default)()) {
    alert('For a better experience, use on mobile!');
  } // get dynamic URLs from data response


  const {
    ingredientURLs,
    productURLs
  } = (0, _getAssetURLs.default)(_data_sources.default); // build and append img elements with ingredient URLs

  const aAssetContainer = document.querySelector('a-assets');
  Object.keys(ingredientURLs).forEach(domId => {
    const imgEl = document.createElement('img');
    imgEl.setAttribute('id', domId);
    imgEl.setAttribute('src', ingredientURLs[domId]);
    aAssetContainer.prepend(imgEl);
  }); // target product ids and set hrefs

  Object.keys(productURLs).forEach(productName => {
    const productEl = document.getElementById(productName);

    if (productEl) {
      const imageEls = productEl.getElementsByTagName('image');

      if (imageEls.length) {
        const imageEl = imageEls[0];
        imageEl.setAttribute('href', productURLs[productName]);
      }
    }
  });
  const $statusLabel = document.querySelector('#status_label');
  const $scanner = document.querySelector('#scanner');
  const $scanLine = document.querySelector('#scanner svg line');
  const $main = document.querySelector('main');
  const $tray = document.querySelector('#tray');
  const $backButton = document.querySelector('a.back');
  const $addButton = document.querySelector('a.add');
  const $serumMarkers = document.querySelectorAll('a-marker');
  let currentProduct = 0; // TODO: Jason please fix my selectors to be smarter T_T

  let $contentFan_1 = document.getElementById("contentFan_serum1");
  let $tabMenu_1 = document.getElementById('tab-menu-1');
  let $tabMenu_2 = document.getElementById('tab-menu-2');
  let $contentFan_2 = document.getElementById("contentFan_serum2");
  let $tabMenu_3 = document.getElementById('tab-menu-3');
  let $contentFan_3 = document.getElementById("contentFan_serum3");
  /** Two useful functions:
    * - pause(X) 
    *    returns a promise that resolves after X milliseconds.
    * 
    * - pauseUntilEnd('transition', $el, 'property_name') ~or~
    *   pauseUntilEnd('animation', $el, 'anim_name')
    *    (where property_name and anim_name are optional)
    *    returns a promise that resolves when an animation or 
    *    transition finishes.
    * 
    * Put them inside an async function and use like so:
    *   await pause(750)
    * ...and it will wait before moving on.
    */

  async function pause(millis) {
    const endTime = new Date(new Date().getTime() + millis);
    return new Promise(resolve => {
      function ticktock() {
        if (new Date() >= endTime) {
          resolve(true);
        } else {
          requestAnimationFrame(ticktock);
        }
      }

      ticktock();
    });
  }

  async function pauseUntilEnd(eventType, el, propertyOrAnimationName) {
    let endEvent = 'transitionend';

    switch (eventType) {
      case 'animation':
      case 'a':
        endEvent = 'animationend';
        break;

      case 'transition':
      case 't':
      default:
        endEvent = 'transitionend';
        break;
    }

    return new Promise(resolve => {
      const endFunction = e => {
        // If specifying the property name on a transition / the animation name on animation...
        if (propertyOrAnimationName) {
          // ...ignore all events that aren't the end of this particular animation/transition.
          if (endEvent === 'animationend' && e.animationName !== propertyOrAnimationName) return;
          if (endEvent === 'transitionend' && e.propertyName !== propertyOrAnimationName) return;
        } // Clean up after.


        el.removeEventListener(endEvent, endFunction);
        resolve(true);
      };

      el.addEventListener(endEvent, endFunction);
    });
  }

  async function productRecognized(productID) {
    // TODO: recognize which product it is and cue up the data in A-Frame here
    currentProduct = productID; // Kick off the animation to scan.
    // $statusLabel.innerHTML = 'Scanning...';
    // $scanner.classList.add('scanning');
    // await pauseUntilEnd('a', $scanLine, 'blip');

    $statusLabel.innerHTML = `Found Serum No. ${productID}!`;
    $scanner.classList.add('complete');
    $main.classList.add('serum' + productID);
    await pause(900);
    $main.classList.add('found');
    await pauseUntilEnd('t', $tray, 'bottom'); // $main.classList.remove('serum'+productID);

    $scanner.classList.remove('scanning');
    $scanner.classList.remove('complete');
  }

  function productOutOfView(e) {
    currentProduct = 0; // Remove all classes from scanner

    $scanner.classList.remove('scanning');
    $scanner.classList.remove('complete');
    let productLine = 'Serums';
    if ($tray.classList.contains('step-4')) productLine = 'Moisturizers'; // Reset the label

    $statusLabel.innerHTML = 'Exploring ' + productLine;
  }

  function backToExplore(e) {
    // Prevent link from going anywhere
    e.stopPropagation();
    e.preventDefault(); // reset the currentProduct

    currentProduct = 0; // Reset the label

    $statusLabel.innerHTML = 'Exploring Serums';
    $scanner.classList.remove('scanning');
    $scanner.classList.remove('complete');
    $main.classList.remove('found');
    $main.classList.remove('serum1');
    $main.classList.remove('serum2');
    $main.classList.remove('serum3'); // ...which will slide up the tray.
    // Prevent changing the URL?

    return false;
  }

  async function addToRoutine(e) {
    // Prevent link from going anywhere
    e.stopPropagation();
    e.preventDefault();
    $statusLabel.textContent = `Serum No. ${currentProduct} added!`;
    $scanner.classList.remove('scanning');
    $scanner.classList.remove('complete');
    $tray.classList.remove('step-3'); // currentProduct = 0;

    $main.classList.remove('found');
    await pause(1300);
    $statusLabel.textContent = 'Exploring Moisturizers';
    $tray.classList.add('step-4');
    console.log('moving to scenario 2'); // TODO: Add listener when click on going-home interstitial

    $main.classList.add('going-home'); // Prevent changing the URL?

    return false;
  }

  function tagToProduct(target) {
    switch (target) {
      case "serum_1_marker":
        return 1;

      case "serum_2_marker":
        return 2;

      case "serum_3_marker":
        return 3;

      default:
        return null;
    }
  }

  $serumMarkers.forEach(function ($marker) {
    $marker.addEventListener("markerFound", e => {
      // your code here}
      let target = e.target;
      let productID = tagToProduct(target.id);

      if (productID) {
        console.log("Detected product ", productID); // call productRecognized

        productRecognized(productID);
      }
    });
    $marker.addEventListener("markerLost", e => {
      // your code here}
      let target = e.target;
      let productID = tagToProduct(target.id);

      if (productID) {
        console.log("Lost product ", productID); // Call productOutOfView

        productOutOfView(productID);
      }
    });
  }); // Create data for scenario 1 for all three serums

  const checkType = "numbered-text";
  const reviewType = "numbered-text";
  const ingredientsType = "textwithicon";
  let scenarioData = [];

  function generateContentFanData() {
    for (let i = 0; i < _data_sources.default.contentstack.serums.length; i++) {
      const csProduct = _data_sources.default.contentstack.serums[i];
      const localProduct = _data_sources.default.personalized.serums[i];
      const productData = {
        why: [],
        reviews: [],
        warnings: []
      };

      for (let j = 0; j < localProduct.why.length; j++) {
        productData.why.push({
          title: '' + (j + 1),
          body: localProduct.why[j],
          type: checkType
        });
      }

      for (let j = 0; j < localProduct.ratings.reviews.length; j++) {
        productData.reviews.push({
          title: localProduct.ratings.reviews[j].title.toUpperCase(),
          body: '\n' + localProduct.ratings.reviews[j].testimonial,
          type: reviewType
        });
      }

      for (let j = 0; j < csProduct.contraindications.length; j++) {
        productData.warnings.push({
          icon: '#warning',
          title: 'CONTRAINDICATIONS',
          body: csProduct.contraindications[j],
          type: ingredientsType
        });
      }

      scenarioData.push(productData);
    }
  }

  generateContentFanData();

  let makePanel = function (data) {
    // Build content panels with "data"
    var panel = document.createElement('a-entity');
    panel.setAttribute("content-group", "");
    let content = panel.components['content-group'];
    content.initializeFromData(data);
    return panel;
  };

  setTimeout(initializeScenario1, 1000);

  function initializeScenario1() {
    // Build content panels with "data"
    let contentFan_1 = $contentFan_1.components.contentfan;
    let contentFan_2 = $contentFan_2.components.contentfan;
    let contentFan_3 = $contentFan_3.components.contentfan; // Add content to content fan
    // At some point we can find a better way to sync this w/the tab menu

    contentFan_1.buildWithContentElements([makePanel(scenarioData[0].warnings), makePanel(scenarioData[0].why), makePanel(scenarioData[0].reviews)]);
    contentFan_2.buildWithContentElements([makePanel(scenarioData[1].warnings), makePanel(scenarioData[1].why), makePanel(scenarioData[1].reviews)]);
    contentFan_3.buildWithContentElements([makePanel(scenarioData[2].warnings), makePanel(scenarioData[2].why), makePanel(scenarioData[2].reviews)]); // Add listeners for buttons

    $backButton.addEventListener('click', backToExplore);
    $addButton.addEventListener('click', addToRoutine); // This is temporary, until we have onmarkerfound event...
    // $tray.addEventListener('click', productRecognized);
    // Swipe detection

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false); // document.addEventListener('swipeleft', handleSwipeLeft, false);
    // document.addEventListener('swiperight', handleSwipeRight, false);

    function handleSwipeLeft() {
      // We are just broadcasting swipes to everyone...not ideal!
      $tabMenu_1.components["tab-menu"].incrementSelectedIndex();
      $tabMenu_2.components["tab-menu"].incrementSelectedIndex();
      $tabMenu_3.components["tab-menu"].incrementSelectedIndex();
      $contentFan_1.components.contentfan.incrementContentIndex();
      $contentFan_2.components.contentfan.incrementContentIndex();
      $contentFan_3.components.contentfan.incrementContentIndex(); // $tabMenu.components.
    }

    function handleSwipeRight() {
      console.log("swipe right!"); // We are just broadcasting swipes to everyone...not ideal!

      $tabMenu_1.components["tab-menu"].decrementSelectedIndex();
      $tabMenu_2.components["tab-menu"].decrementSelectedIndex();
      $tabMenu_3.components["tab-menu"].decrementSelectedIndex();
      $contentFan_1.components.contentfan.decrementContentIndex();
      $contentFan_2.components.contentfan.decrementContentIndex();
      $contentFan_3.components.contentfan.decrementContentIndex();
    } // Originally from https://stackoverflow.com/a/23230280


    var xDown = null;
    var yDown = null;

    function getTouches(evt) {
      return evt.touches;
    }

    function handleTouchStart(evt) {
      const firstTouch = getTouches(evt)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
    }

    ;

    function handleTouchMove(evt) {
      if (!xDown || !yDown) {
        return;
      }

      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;
      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /*most significant*/
        if (xDiff > 0) {
          /* left swipe */
          handleSwipeLeft();
        } else {
          handleSwipeRight();
          /* right swipe */
        }
      } else {
        if (yDiff > 0) {
          /* up swipe */
        } else {
            /* down swipe */
          }
      }
      /* reset values */


      xDown = null;
      yDown = null;
    }

    ;
  }
});
},{"../js/data_sources":"tBe1","../utils/getAssetURLs":"WonQ","../utils/createNavLinks":"QOCG","../utils/detectDesktop":"Ony6"}]},{},["ev72"], null)
//# sourceMappingURL=/skincare/scenario1.f55979e2.js.map