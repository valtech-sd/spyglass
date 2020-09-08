$( document ).ready(function() {
  var anchorRef = document.getElementById('twistParent');
  var contentFanRef = document.getElementById("contentFan")

  // Update our content fan if we've detected a new tag
  anchorRef.addEventListener("tag-index-trigger", (e)=>{ // your code here}
    let index = e.detail.index
    let animator = contentFanRef.components["content-fan"]
    animator.animateToContent(index)
  })

  // Wiggle our content fan if the current tag has been rotated slightly
  anchorRef.addEventListener("tag-rotation", (e)=>{ // your code here}
    let index = e.detail.index
    let offset = e.detail.normalizedRotation
    let animator = contentFanRef.components["content-fan"]

    animator.animateContentOffset(offset)
  })
});
