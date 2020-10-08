import data_sources from '../js/data_sources';
import getAssetURLs from '../utils/getAssetURLs';
import makePanel from '../utils/makePanel';

function ready(fn) {
  // replaces $(document).ready() in jQuery
  if (document.readyState != 'loading'){
      fn();
  } else {
      document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(async () => {
  console.log('DOM is ready.');
  // Wait for the Contentstack data to come back before proceeding!
  await data_sources.getData();

  // get dynamic URLs from data response
  const { ingredientURLs, productURLs } = getAssetURLs(data_sources);

  // build and append img elements with ingredient URLs
  const aAssetContainer = document.querySelector('a-assets');
  Object.keys(ingredientURLs).forEach(domId => {
    const imgEl = document.createElement('img'); 
    imgEl.setAttribute('id', domId);
    imgEl.setAttribute('src', ingredientURLs[domId]);
    aAssetContainer.prepend(imgEl);
  })

  // target product ids and set hrefs
  Object.keys(productURLs).forEach(productName => {
    const productEl = document.getElementById(productName);
    if (productEl) {
      const imageEls = productEl.getElementsByTagName('image');
      if (imageEls.length) {
        const imageEl = imageEls[0];
        imageEl.setAttribute('href', productURLs[productName])
      }
    }
  })


  const $statusLabel = document.querySelector('#status_label');
  const $scanner = document.querySelector('#scanner');
  const $scanLine = document.querySelector('#scanner svg line');
  const $main = document.querySelector('main');
  const $tray = document.querySelector('#tray');
  const $backButton = document.querySelector('a.back');
  const $addButton = document.querySelector('a.add');
  const $serumMarkers = document.querySelectorAll('a-marker');
  let currentProduct = 0;

  // TODO: Jason please fix my selectors to be smarter T_T

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
    return new Promise((resolve) => {
      function ticktock() {
        if (new Date() >= endTime) {
          resolve(true);
        } else {
          requestAnimationFrame(ticktock);
        }
      }
      ticktock();
    })
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
    return new Promise((resolve) => {
      const endFunction = (e) => {
        // If specifying the property name on a transition / the animation name on animation...
        if (propertyOrAnimationName) {
          // ...ignore all events that aren't the end of this particular animation/transition.
          if (endEvent === 'animationend' && e.animationName !== propertyOrAnimationName) return;
          if (endEvent === 'transitionend' && e.propertyName !== propertyOrAnimationName) return;
        }
        // Clean up after.
        el.removeEventListener(endEvent, endFunction);
        resolve(true);
      }
      el.addEventListener(endEvent, endFunction);
    });
  }
  
  async function productRecognized(productID) {
    // TODO: recognize which product it is and cue up the data in A-Frame here
    currentProduct = productID;

    // Kick off the animation to scan.
    // $statusLabel.innerHTML = 'Scanning...';
    // $scanner.classList.add('scanning');
    // await pauseUntilEnd('a', $scanLine, 'blip');
    $statusLabel.innerHTML = `Found Serum No. ${productID}!`;
    $scanner.classList.add('complete');
    $main.classList.add('serum'+productID);
    await pause(900);
    $main.classList.add('found');
    await pauseUntilEnd('t', $tray, 'bottom');
    // $main.classList.remove('serum'+productID);
    $scanner.classList.remove('scanning');
    $scanner.classList.remove('complete');
  }

  function productOutOfView(e) {
    currentProduct = 0;

    // Remove all classes from scanner
    $scanner.classList.remove('scanning');
    $scanner.classList.remove('complete');
    let productLine = 'Serums';
    if ($tray.classList.contains('step-4')) productLine = 'Moisturizers';
    // Reset the label
    $statusLabel.innerHTML = 'Exploring '+productLine;
  }
  function backToExplore(e) {
    // Prevent link from going anywhere
    e.stopPropagation();
    e.preventDefault();
    // reset the currentProduct
    currentProduct = 0;
    // Reset the label
    $statusLabel.innerHTML = 'Exploring Serums';
    $scanner.classList.remove('scanning');
    $scanner.classList.remove('complete');
    $main.classList.remove('found');
    $main.classList.remove('serum1');
    $main.classList.remove('serum2');
    $main.classList.remove('serum3');
    // ...which will slide up the tray.
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
    $tray.classList.remove('step-3');

    // currentProduct = 0;
    $main.classList.remove('found');
    await pause(1300);
    $statusLabel.textContent = 'Exploring Moisturizers';
    $tray.classList.add('step-4');


    console.log('moving to scenario 2');
    // TODO: Add listener when click on going-home interstitial
    $main.classList.add('going-home');
    // Prevent changing the URL?
    return false;
  }

  function tagToProduct(target) {
    switch(target) {
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


  $serumMarkers.forEach(function($marker) {

    $marker.addEventListener("markerFound", (e)=>{ // your code here}
      let target = e.target;
      let productID = tagToProduct(target.id);

      if (productID) {
        console.log("Detected product ", productID);

        // call productRecognized
        productRecognized(productID);
      }
    })

    $marker.addEventListener("markerLost", (e)=>{ // your code here}
      let target = e.target;
      let productID = tagToProduct(target.id);

      if (productID) {
        console.log("Lost product ", productID);

        // Call productOutOfView
        productOutOfView(productID);
      }
    })
  });

  // Create data for scenario 1 for all three serums
  const checkType = "numbered-text";
  const reviewType = "numbered-text";
  const ingredientsType = "textwithicon";
  let scenarioData = [];
  
  function generateContentFanData() {
    for (let i = 0; i < data_sources.contentstack.serums.length; i++) {
      const csProduct = data_sources.contentstack.serums[i];
      const localProduct = data_sources.personalized.serums[i];
      const productData = {
        why: [],
        reviews: [],
        warnings: []
      }
      for (let j = 0; j < localProduct.why.length; j++) {
        productData.why.push({
          title: ''+(j+1),
          body: localProduct.why[j],
          type: checkType
        })
      }
      for (let j = 0; j < localProduct.ratings.reviews.length; j++) {
        productData.reviews.push({
          title: localProduct.ratings.reviews[j].title.toUpperCase(),
          body: '\n' + localProduct.ratings.reviews[j].testimonial,
          type: reviewType
        });
      }
      for (let j=0; j < csProduct.contraindications.length; j++) {
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

  setTimeout(initializeScenario1, 1000);

  function initializeScenario1() {

    // Build content panels with "data"
    let contentFan_1 = $contentFan_1.components.contentfan
    let contentFan_2 = $contentFan_2.components.contentfan
    let contentFan_3 = $contentFan_3.components.contentfan

    // Add content to content fan
    // At some point we can find a better way to sync this w/the tab menu
    contentFan_1.buildWithContentElements([makePanel(scenarioData[0].warnings), makePanel(scenarioData[0].why), makePanel(scenarioData[0].reviews)]);
    contentFan_2.buildWithContentElements([makePanel(scenarioData[1].warnings), makePanel(scenarioData[1].why), makePanel(scenarioData[1].reviews)]);
    contentFan_3.buildWithContentElements([makePanel(scenarioData[2].warnings), makePanel(scenarioData[2].why), makePanel(scenarioData[2].reviews)]);

    // Add listeners for buttons
    $backButton.addEventListener('click', backToExplore);
    $addButton.addEventListener('click', addToRoutine);
    // This is temporary, until we have onmarkerfound event...
    // $tray.addEventListener('click', productRecognized);

    // Swipe detection
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    // document.addEventListener('swipeleft', handleSwipeLeft, false);
    // document.addEventListener('swiperight', handleSwipeRight, false);

    function handleSwipeLeft() {
      // We are just broadcasting swipes to everyone...not ideal!
      $tabMenu_1.components["tab-menu"].incrementSelectedIndex()
      $tabMenu_2.components["tab-menu"].incrementSelectedIndex()
      $tabMenu_3.components["tab-menu"].incrementSelectedIndex()

      $contentFan_1.components.contentfan.incrementContentIndex()
      $contentFan_2.components.contentfan.incrementContentIndex()
      $contentFan_3.components.contentfan.incrementContentIndex()

      // $tabMenu.components.
    }

    function handleSwipeRight() {
      console.log("swipe right!")
      // We are just broadcasting swipes to everyone...not ideal!
      $tabMenu_1.components["tab-menu"].decrementSelectedIndex()
      $tabMenu_2.components["tab-menu"].decrementSelectedIndex()
      $tabMenu_3.components["tab-menu"].decrementSelectedIndex()

      $contentFan_1.components.contentfan.decrementContentIndex()
      $contentFan_2.components.contentfan.decrementContentIndex()
      $contentFan_3.components.contentfan.decrementContentIndex()
    }

    // Originally from https://stackoverflow.com/a/23230280
    var xDown = null;
    var yDown = null;

    function getTouches(evt) {
      return evt.touches;
    }

    function handleTouchStart(evt) {
      const firstTouch = getTouches(evt)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
    };

    function handleTouchMove(evt) {
      if (!xDown || !yDown) {
        return;
      }

      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;

      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
        if (xDiff > 0) {
          /* left swipe */
          handleSwipeLeft()
        } else {
          handleSwipeRight()
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
    };
  }
})