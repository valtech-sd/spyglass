export default (assets, container) => {

  Object.keys(assets).forEach(assetName => {
    const imgEl = document.createElement('img'); 
    imgEl.setAttribute('id', assetName);
    imgEl.setAttribute('crossorigin', "anonymous");
    // add a generic fallback image if the ingredientURL is undefined
    if (assets[assetName] === undefined) {
      assets[assetName] = require('../assets/generic.png');
      console.log(`updated undefined ${assetName} to fallbackImageURL`);
    }
    imgEl.setAttribute('src', assets[assetName]);
    container.prepend(imgEl);
  })


}