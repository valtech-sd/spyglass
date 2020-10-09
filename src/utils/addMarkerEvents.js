const tagToProduct = target => {
  switch(target) {
    case "serum_1_marker":
    case "mainMarker":
      return 1;
    case "serum_2_marker":
      return 2;
    case "serum_3_marker":
      return 3;
    default:
    return null;
  }
}

export default (markerArray, found, lost) => {


  markerArray.forEach(marker => {

    if (typeof found === 'function') {
      marker.addEventListener("markerFound", e => {
        console.log('a-marker with id', e.target.id);
        const productID = tagToProduct(e.target.id);
        if (productID) {
          console.log("Detected product ", productID);
          // call found function
          found(productID);
        }
      })
    }

    if (typeof lost === 'function') {
      marker.addEventListener("markerLost", e => {
        const productID = tagToProduct(e?.target?.id);
        if (productID) {
          console.log("Lost product ", productID);
          // call lost function
          lost(productID);
        }
      })
    }
    
  });

}