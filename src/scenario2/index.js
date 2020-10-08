import data_sources from '../js/data_sources';
import getAssetURLs from '../utils/getAssetURLs';

function ready(fn) {
  // replaces $(document).ready() in jQuery
  if (document.readyState != 'loading'){
    setTimeout(fn, 1000);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(fn, 1000);
    });
  }
}

ready(async function() {
  console.log( "DOM loaded" );
  await data_sources.getData();
  console.log(data_sources);

  // get dynamic URLs from data response
  const { ingredientURLs } = getAssetURLs(data_sources);
  console.log('ingredientURLs:', ingredientURLs); 

  // build and append img elements with ingredient URLs
  const aAssetContainer = document.querySelector('a-assets');
  const fallbackImageURL = 'https://images.contentstack.io/v3/assets/blte63f7056be4da683/bltb57173579e7bb2b3/5f7e5c583dea860e7be3e122/generic.png';

  Object.keys(ingredientURLs).forEach(domId => {
    const imgEl = document.createElement('img'); 
    imgEl.setAttribute('id', domId);
    // add a generic fallback image if the ingredientURL is undefined
    if (ingredientURLs[domId] === undefined) {
      ingredientURLs[domId] = fallbackImageURL;
      console.log(`updated undefined ${domId} to fallbackImageURL`);
    }
    imgEl.setAttribute('src', ingredientURLs[domId]);
    aAssetContainer.prepend(imgEl);
  })

  const usageType = "textwithicon";
  const benefitsType = "textwithicon";

  let scenarioData = [];
  
  function generateContentFanData() {
    for (let i = 0; i < data_sources.contentstack.serums.length; i++) {
      const csProduct = data_sources.contentstack.serums[i];
      const localProduct = data_sources.personalized.serums[i];
      const productData = {
        forYou: [],
        usage: [],
        benefits: []
      }
      for (let j = 0; j < csProduct.directions.length; j++) {
        productData.usage.push({
          icon: "#step"+(j+1),
          title: null,
          body: csProduct.directions[j].text,
          type: usageType
        });
      }
      for (let j=0; j < csProduct.ingredients.length && j < 2; j++) {
        productData.benefits.push({
          icon: '#'+csProduct.ingredients[j].name.toLowerCase().split(' ').join(''),
          title: csProduct.ingredients[j].name.toUpperCase(),
          body: csProduct.ingredients[j].description,
          type: benefitsType
        });
      }
      scenarioData.push(productData);
    }
  }
  generateContentFanData();


  // This is a duplicated helper that should be consolidated!
  let makePanel = function(data) {
    // Build content panels with "data"
    var panel = document.createElement('a-entity');
    panel.setAttribute("content-group", "");

    let content = panel.components['content-group'];
    content.initializeFromData(data);

    return panel
  }

  let $contentFan = document.getElementById("contentFan");
  let contentFan = $contentFan.components.contentfan
  let $tabMenu = document.getElementById('tab-menu');

  // These are out of order bc I'm bad: 3 1 2
  // The angle of the content fan looks better w/3 pieces of data!
  // It's a hack
  contentFan.buildWithContentElements([
    makePanel(scenarioData[0].benefits), 
    makePanel(scenarioData[0].usage),
    makePanel(scenarioData[0].benefits)
  ]);

  var anchorRef = document.getElementById('twistParent');

  anchorRef.addEventListener("tag-index-trigger", (e)=>{ // your code here}
    let index = e.detail.index
    $tabMenu.components["tab-menu"].selectIndex(index)
    contentFan.animateToContent(index)
  })
});





