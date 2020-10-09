export default (data) => {

  /**
   * The job of this function is to:
   * go through the data, identify ingredient and product assets URLs,
   * return them in organized format
   * 
   * future work:
   * expand data response to include other assets, eg. videos, moisturizer images
   */

  const ingredientURLs = {};
  const productURLs = {};

  data.contentstack?.serums?.forEach(serum => {

    serum.ingredients?.forEach(ingredient => {
      // remove white space and lowercase to create the dom id
      const domId = ingredient.name.replace(/ /g, '').toLowerCase();
      // no duplicates
      if (ingredientURLs[domId] === undefined && ingredient.image_url) {
        ingredientURLs[domId] = ingredient.image_url;
      }
      // perhaps we need to be more clever and check the also_known_as names
    })

    const productId = `serum${serum._id}`;

    if (serum.product_image_urls.length) {
      productURLs[productId] = serum.product_image_urls[0];
    }

  });

  return {
    ingredientURLs,
    productURLs
  }

};