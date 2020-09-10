
import fontImg from './assets/din_ot.png'
import fontFile from './assets/din_ot.fnt'

// Also have to do the icons?

function ready(fn) {
  // replaces $(document).ready() in jQuery
  if (document.readyState != 'loading'){

    setTimeout(fn, 3000);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(fn, 3000);
    });
  }
}

ready(function() {
  console.log( "DOM loaded" );

  var sceneRef = document.querySelector('a-scene');


  // <a-entity content-group position="-3 5.5 -50">
  //   <a-entity textwithicon position="0 0 0"></a-entity>
  //   <a-entity textwithicon position="0 0 0"></a-entity>
  // </a-entity>

  // Test data
  let usageData = [
    {
    icon: "#step1",
    title: null,
    body: "Cleanse and tone head and neck."
    }, {
    icon: "#step2",
    title: null,
    body: "Measure out 1/2 teaspoon of serum."
    }, {
    icon: "#step3",
    title: null,
    body: "Massage into skin twice daily."
  }];

  let benefitsData = [
    {
      icon: "#ylangylang",
      title: "YLANG YLANG",
      body: "Sweet, exotic and floral, essential oil distilled from the fragrant flowers.."
    }, {
      icon: "#panthenol",
      title: "PANTHENOL",
      body: "Also called B5 Vitamin, moisturizes the skin."
    }];


  let makePanel = function(data) {
    // Build content panels with "data"
    var panel = document.createElement('a-entity');
    panel.setAttribute("content-group", "");

    let content = panel.components['content-group'];
    content.initializeFromData(data);

    return panel
  }

  // Build content panels with "data"
  var usagePanel = makePanel(usageData);
  var benefitsPanel = makePanel(benefitsData);
  var benefitsPanel2 = makePanel(benefitsData);

  // Provide content panel with an array of objects
  var anchorRef = document.getElementById('twistParent');
  var tabMenuRef = document.getElementById('tab-menu');
  var contentFanRef = document.getElementById("contentFan");
  let contentContainerRef = document.getElementById("container");


  let contentFan = contentFanRef.components.contentfan

  // Add content to content fan
  // At some point we can find a better way to sync this w/the tab menu
  contentFan.buildWithContentElements([benefitsPanel, usagePanel, benefitsPanel2 ]);

  // console.log(anchorRef);
  // Update our content fan if we've detected a new tag
  anchorRef.addEventListener("tag-index-trigger", (e)=>{ // your code here}
    let index = e.detail.index

    console.log("tag index triggered! ", index)
    tabMenuRef.components["tab-menu"].selectIndex(index)
    let animator = contentFanRef.components["contentfan"]
    animator.animateToContent(index)
  })

  anchorRef.addEventListener("tag-rotation", (e)=>{ // your code here}

    let tracker = contentContainerRef.components["smoothed-marker-tracker"]
    tracker.onMarkerPositionUpdate(e)



    // animator.animateContentOffset(offset)
  })

  anchorRef.addEventListener("tag-position", (e)=>{ // your code here}

    let tracker = contentContainerRef.components["smoothed-marker-tracker"]
    tracker.onMarkerPositionUpdate(e)

    // animator.animateContentOffset()
    // animator.animateContentOffset(offset)
  })

  anchorRef.addEventListener("tracking-started", (e)=>{ // your code here}

    console.log("tracking started")
    let tracker = contentContainerRef.components["smoothed-marker-tracker"]
    tracker.onMarkerTrackingStarted(e)

    // animator.animateContentOffset()
    // animator.animateContentOffset(offset)
  })

  anchorRef.addEventListener("tracking-ended", (e)=>{ // your code here}

    console.log("tracking ended")
    let tracker = contentContainerRef.components["smoothed-marker-tracker"]
    tracker.onMarkerTrackingEnded(e)

    // animator.animateContentOffset()
    // animator.animateContentOffset(offset)
  })

  // Wiggle our content fan if the current tag has been rotated slightly
  // anchorRef.addEventListener("tag-rotation", (e)=>{ // your code here}
  //   // let index = e.detail.index
  //   // let offset = e.detail.normalizedRotation
  //   // let animator = contentFanRef.components["content-fan"]
  //
  //   // animator.animateContentOffset(offset)
  // })



});





