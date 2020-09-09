
import fontImg from './assets/din_ot.png'
import fontFile from './assets/din_ot.fnt'

// Also have to do the icons?

function ready(fn) {
  // replaces $(document).ready() in jQuery
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
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
    icon: "",
    title: null,
    body: "Cleanse and tone head and neck."
    }, {
    icon: "",
    title: null,
    body: "Measure out 1/2 teaspoon of serum."
    }, {
    icon: "",
    title: null,
    body: "Massage into skin twice daily."
  }];

  let benefitsData = [
    {
      icon: "",
      title: "YLANG YLANG",
      body: "Sweet, exotic and floral, essential oil distilled from the fragrant flowers.."
    }, {
      icon: "",
      title: "PANTHENOL",
      body: "Also called B5 Vitamin, moisturizes the skin."
    }];


  let makePanel = function(data) {
    // Build content panels with "data"
    var panel = document.createElement('a-entity');
    panel.setAttribute("content-group", "");
    panel.setAttribute("position", "-3 5.5 -50")

    // sceneRef.append(panel);

    let content = panel.components['content-group'];
    content.initializeFromData(data);
  }

  // Build content panels with "data"
  var usagePanel = makePanel(usageData);
  var benefitsPanel = makePanel(benefitsData);

  // Provide content panel with an array of objects
  var anchorRef = document.getElementById('twistParent');
  var tabMenuRef = document.getElementById('tab-menu');
  // var contentFanRef = document.getElementById("contentFan")

  console.log("anchor ref");

  console.log(anchorRef);
  // Update our content fan if we've detected a new tag
  anchorRef.addEventListener("tag-index-trigger", (e)=>{ // your code here}
    let index = e.detail.index

    console.log("tag index triggered! ", index)
    tabMenuRef.components["tab-menu"].selectIndex(index)
    // let animator = contentFanRef.components["content-fan"]
    // animator.animateToContent(index)
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





