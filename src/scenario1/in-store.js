import data_sources from '../js/data_sources';

function ready(fn) {
  // replaces $(document).ready() in jQuery
  if (document.readyState != 'loading'){
      fn();
  } else {
      document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(() => {
  console.log('DOM is ready.');
  console.log(data_sources);
  const $statusLabel = document.querySelector('#status_label');
  const $scanner = document.querySelector('#scanner');
  const $scanLine = document.querySelector('#scanner svg line');
  const $main = document.querySelector('main');
  const $tray = document.querySelector('#tray');
  const $backButton = document.querySelector('a.back');
  const $addButton = document.querySelector('a.add');
  const $serumMarkers = document.querySelectorAll('a-marker');


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

    // Kick off the animation to scan.
    $statusLabel.innerHTML = 'Scanning...';
    $scanner.classList.add('scanning');
    await pauseUntilEnd('a', $scanLine, 'blip');
    $statusLabel.textContent = 'Found!';
    $scanner.classList.add('complete');
    $main.classList.add('serum'+productID);
    await pause(750);
    $main.classList.add('found');
    $main.classList.remove('serum'+productID);
    $scanner.classList.remove('scanning');
    $scanner.classList.remove('complete');
  }

  function productOutOfView(e) {
    // Remove all classes from scanner
    $scanner.classList.remove('scanning');
    $scanner.classList.remove('complete');
    // Reset the label
    $statusLabel.innerHTML = 'Explore Serums';
  }
  function backToExplore(e) {
    // Prevent link from going anywhere
    e.stopPropagation();
    e.preventDefault();
    // Reset the label
    $statusLabel.innerHTML = 'Explore Serums';
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

    $statusLabel.textContent = 'Explore Serums';
    $scanner.classList.remove('scanning');
    $scanner.classList.remove('complete');
    $main.classList.remove('found');
    await pauseUntilEnd('transition', $tray, 'bottom');

    $statusLabel.textContent = 'Explore Moisturizers';
    $tray.classList.remove('step-3');
    $tray.classList.add('step-4');
    await pause(1000);

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
        productOutOfView(productID)
      }
    })
  });


  // Fake data for scenario 1
  let checkType = "numbered-text";
  let checkData = [
    {
      title: "1",
      body: "Your goal is moisturizing.",
      type: checkType
    }, {
      title: "2",
      body: "Better than leading competitors' products.",
      type: checkType
    }, {
      title: "3",
      body: "Cheaper than leading competitors' products.",
      type: checkType
    }, {
      title: "4",
      body: "No allergens for you!",
      type: checkType
    }
    ];

  let reviewType = "numbered-text"
  let reviewsData = [
    {
      title: "THE BEST SERUM OUT THERE",
      body: "\n\"This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even.\"",
      type: reviewType
    }
    ];

  let benefitsType = "textwithicon"
  let benefitsData = [
    {
      icon: "#ylangylang",
      title: "YLANG YLANG",
      body: "Sweet, exotic and floral, essential oil distilled from the fragrant flowers..",
      type: benefitsType
    }, {
      icon: "#panthenol",
      title: "PANTHENOL",
      body: "Also called B5 Vitamin, moisturizes the skin.",
      type: benefitsType
    }];
  // let benefitsData = [
  //   {
  //     icon: "#warning",
  //     title: "INTERACTIONS",
  //     body: data_sources.contentstack.serums[0].contraindications[0],
  //     type: benefitsType
  //   }
  // ];

  let makePanel = function(data) {
    // Build content panels with "data"
    var panel = document.createElement('a-entity');
    panel.setAttribute("content-group", "");

    let content = panel.components['content-group'];
    content.initializeFromData(data);

    return panel
  }

  setTimeout(initializeScenario1, 1000);

  function initializeScenario1() {

    // Build content panels with "data"
    let contentFan_1 = $contentFan_1.components.contentfan
    let contentFan_2 = $contentFan_2.components.contentfan
    let contentFan_3 = $contentFan_3.components.contentfan

    // Add content to content fan
    // At some point we can find a better way to sync this w/the tab menu
    contentFan_1.buildWithContentElements([makePanel(benefitsData), makePanel(checkData), makePanel(reviewsData)]);
    contentFan_2.buildWithContentElements([makePanel(benefitsData), makePanel(checkData), makePanel(reviewsData)]);
    contentFan_3.buildWithContentElements([makePanel(benefitsData), makePanel(checkData), makePanel(reviewsData)]);

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