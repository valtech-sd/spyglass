$( document ).ready(function() {
  console.log( "DOM loaded" );
  var sceneEl = document.querySelector('a-scene');
  console.log(sceneEl)

  var anchorRef = document.getElementById('twistParent');
  var contentFanRef = document.getElementById("contentFan")

  anchorRef.addEventListener("tag-index-trigger", (e)=>{ // your code here}
    // console.log("Marker index tagged!")

    let index = e.detail.index
    let animator = contentFanRef.components["content-fan"]
    animator.animateToContent(index)
  })

  anchorRef.addEventListener("tag-rotation", (e)=>{ // your code here}
    // console.log("marker rotation tagged!")

    let index = e.detail.index
    let offset = e.detail.normalizedRotation

    // console.log(e.detail)
  })
});
