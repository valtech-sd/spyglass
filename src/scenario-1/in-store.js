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
  const $statusLabel = document.querySelector('#status_label');
  const $scanner = document.querySelector('#scanner');
  const $scanLine = document.querySelector('#scanner svg line');
  const $main = document.querySelector('main');
  const $tray = document.querySelector('#tray');
  const $backButton = document.querySelector('a.back');
  const $addButton = document.querySelector('a.add');

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
  
  async function productRecognized(e) {
    // TODO: recognize which product it is and cue up the data in A-Frame here

    // Kick off the animation to scan.
    $statusLabel.innerHTML = 'Scanning...';
    $scanner.classList.add('scanning');
    await pauseUntilEnd('a', $scanLine, 'blip');
    $statusLabel.textContent = 'Found!';
    $scanner.classList.add('complete');
    await pause(750);
    $main.classList.add('found');
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

  // Add custom listeners for events when marker is recognized
  document.addEventListener('markerfound', productRecognized);
  document.addEventListener('markerlostscan', productOutOfView);

  // Add listeners for buttons
  $backButton.addEventListener('click', backToExplore);
  $addButton.addEventListener('click', addToRoutine);
  // This is temporary, until we have onmarkerfound event...
  $tray.addEventListener('click', productRecognized);

})