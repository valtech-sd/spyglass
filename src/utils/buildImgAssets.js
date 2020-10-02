export default (data, container) => {

  /**
   * The job of this function is to:
   * go through the data, identify image assets URLs,
   * create img elements, apply ids and URL srcs
   * append them to the a-assets container
   * 
   * future work:
   * potentially include other assets, eg.videos
   */

  const imgAssets = {};

  data.contentstack?.serums?.forEach(serum => {

    serum.ingredients?.forEach(ingredient => {
      // remove white space and lowercase to create the dom id
      const domId = ingredient.name.replace(/ /g, '').toLowerCase();
      // no duplicates
      if (imgAssets[domId] === undefined) {
        imgAssets[domId] = ingredient.image_url;
      }
      // perhaps we need to be more clever and check the also_known_as names

    })

  })

  // build and append img elements
  Object.keys(imgAssets).forEach(domId => {
    const imgEl = document.createElement('img'); 
    imgEl.setAttribute('id', domId);
    imgEl.setAttribute('src', imgAssets[domId]);
    container.prepend(imgEl);
  })

};