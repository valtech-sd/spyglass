import data_sources from '../js/data_sources';
import getAssetURLs from '../utils/getAssetURLs';
import buildDynamicAssets from '../utils/buildDynamicAssets';
import createNavLinks from '../utils/createNavLinks';
import detectDesktop from '../utils/detectDesktop';
import makePanel from '../utils/makePanel';
import addMarkerEvents from '../utils/addMarkerEvents';
import Hint from '../utils/Hint';

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

  // create nav links
  const navContainer = document.createElement('section');
  navContainer.className = 'nav-container';
  const navLinks = createNavLinks();
  navLinks.forEach(navLink => navContainer.appendChild(navLink))
  document.body.appendChild(navContainer);

  // Wait for the Contentstack data to come back before proceeding!
  await data_sources.getData();

  // detect desktop and alert
  if (detectDesktop()) {
    alert('For a better experience, use on mobile!');
  }

  // get dynamic URLs from data response, build assets and add them to the asset container
  const { ingredientURLs, productURLs } = getAssetURLs(data_sources);
  const aAssetContainer = document.querySelector('a-assets');
  buildDynamicAssets(ingredientURLs, aAssetContainer);

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
  const $tray = document.querySelector('#tray');
  const $backButton = document.querySelector('a.back');
  const $addButton = document.querySelector('a.add');
  const $serumMarkers = document.querySelectorAll('a-marker');


  const hintEl = document.querySelector('.hint');
  const circle = hintEl.querySelector('.circle');
  let leftSlideTimeout = null;
  let rightSlideTimeout = null;

  const hintAnimation = {
    start: () => {
      console.log('playing hint animation');
      const slideLeftDelay = 700;
      const slideRightDelay = 2000;
      hintEl.classList.add('show');
      leftSlideTimeout = setTimeout(() => circle.classList.add('slide-left'), slideLeftDelay);
      rightSlideTimeout = setTimeout(() => circle.classList.add('slide-right'), slideRightDelay);
    },
    stop: () => {
      console.log('stopping hint animation');
      clearTimeout(leftSlideTimeout);
      clearTimeout(rightSlideTimeout);
      hintEl.classList.remove('show');
      circle.classList.remove('slide-left');
      circle.classList.remove('slide-right');
    }
  }

  const hint = new Hint({
    duration: 3000,
    delay: 3000,
    animation: hintAnimation
  });
  let currentProduct = 0;
  
  // TODO: Jason please fix my selectors to be smarter T_T

  const $contentFan_1 = document.getElementById("contentFan_serum1");
  const $tabMenu_1 = document.getElementById('tab-menu-1');

  const $tabMenu_2 = document.getElementById('tab-menu-2');
  const $contentFan_2 = document.getElementById("contentFan_serum2");

  const $tabMenu_3 = document.getElementById('tab-menu-3');
  const $contentFan_3 = document.getElementById("contentFan_serum3");

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

  
  
  const productRecognized = async productID => {
    // TODO: recognize which product it is and cue up the data in A-Frame here
    currentProduct = productID;

    // start hint and pass in start animation function
    hint.start();

    // Kick off the animation to scan.
    // $statusLabel.innerHTML = 'Scanning...';
    // $scanner.classList.add('scanning');
    // await pauseUntilEnd('a', $scanLine, 'blip');
    $statusLabel.innerHTML = `Found Serum No. ${productID}!`;
    $scanner.classList.add('complete');
    document.body.classList.add('serum'+productID);
    await pause(900);
    document.body.classList.add('found');
    await pauseUntilEnd('t', $tray, 'bottom');
    $scanner.classList.remove('scanning');
    $scanner.classList.remove('complete');
    
  }

  const productOutOfView = () => {
    currentProduct = 0;

    // Remove all classes from scanner
    $scanner.classList.remove('scanning');
    $scanner.classList.remove('complete');
    let productLine = 'Serums';
    if ($tray.classList.contains('step-4')) productLine = 'Moisturizers';
    // Reset the label
    $statusLabel.innerHTML = 'Exploring '+productLine;
    // stop hint and pass in stop animation
    hint.stop();
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
    document.body.classList.remove('found');
    document.body.classList.remove('serum1');
    document.body.classList.remove('serum2');
    document.body.classList.remove('serum3');
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
    document.body.classList.remove('found');
    await pause(1300);
    $statusLabel.textContent = 'Exploring Moisturizers';
    $tray.classList.add('step-4');


    console.log('moving to scenario 2');
    // TODO: Add listener when click on going-home interstitial
    document.body.classList.add('going-home');
    // Prevent changing the URL?
    return false;
  }

  // add marker found and lost events
  addMarkerEvents($serumMarkers, productRecognized, productOutOfView);


  // Create data for scenario 1 for all three serums
  const checkType = "numbered-text";
  const reviewType = "numbered-text";
  const ingredientsType = "textwithicon";
  const scenarioData = [];
  
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
    const contentFan_1 = $contentFan_1.components.contentfan
    const contentFan_2 = $contentFan_2.components.contentfan
    const contentFan_3 = $contentFan_3.components.contentfan

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
    document.addEventListener('touchstart', handleTouchEnd, false);
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
    let xDown = null;
    let yDown = null;

    function getTouches(evt) {
      return evt.touches;
    }

    function handleTouchStart(evt) {
      const firstTouch = getTouches(evt)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
      hint.stop();
    };

    function handleTouchEnd(evt) {
      // if we have the product in shot, we can start the hint timer again
      if (currentProduct !== 0) {
        hint.start();
      }
      
    };

    function handleTouchMove(evt) {
      if (!xDown || !yDown) {
        return;
      }

      const xUp = evt.touches[0].clientX;
      const yUp = evt.touches[0].clientY;

      const xDiff = xDown - xUp;
      const yDiff = yDown - yUp;

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