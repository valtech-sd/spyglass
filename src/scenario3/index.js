import data_sources from '../js/data_sources';
import getAssetURLs from '../utils/getAssetURLs';
import buildDynamicAssets from '../utils/buildDynamicAssets';
import createNavLinks from '../utils/createNavLinks';
import detectDesktop from '../utils/detectDesktop';

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

  // create nav links
  const main = document.querySelector('main');
  const navContainer = document.createElement('section');
  navContainer.className = 'nav-container';
  const navLinks = createNavLinks();
  navLinks.forEach(navLink => navContainer.appendChild(navLink))
  main.appendChild(navContainer);

  await data_sources.getData();
  
  // detect desktop and alert
  if (detectDesktop()) {
    alert('For a better experience, use on mobile!');
  }

  // get dynamic URLs from data response, build assets and add them to the asset container
  const { ingredientURLs } = getAssetURLs(data_sources);
  const aAssetContainer = document.querySelector('a-assets');
  buildDynamicAssets(ingredientURLs, aAssetContainer);

  const forYouType = "text-paragraph-bar";
  const usageType = "textwithicon";
  const benefitsType = "textwithicon";

  const scenarioData = [];
  
  function generateContentFanData() {
    for (let i = 0; i < data_sources.contentstack.serums.length; i++) {
      const csProduct = data_sources.contentstack.serums[i];
      const localProduct = data_sources.personalized.serums[i];
      const productData = {
        forYou: [],
        usage: [],
        benefits: []
      }
      for (let j = 0; j < localProduct.for_you.length; j++) {
        productData.forYou.push({
          title: localProduct.for_you[j].title.toUpperCase(),
          body: localProduct.for_you[j].text,
          type: forYouType
        })
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
  let $reviewContent= document.getElementById('review-content'); // menu and text
  let $productContent = document.getElementById('product-content');
  let $reviewMenu = document.getElementById('review-product-menu');

  // These are out of order bc I'm bad: 3 1 2
  contentFan.buildWithContentElements([
    makePanel(scenarioData[0].benefits), 
    makePanel(scenarioData[0].forYou), 
    makePanel(scenarioData[0].usage)
  ]);

  var anchorRef = document.getElementById('twistParent');
  var mainMarkerRef = document.getElementById('mainMarker');

  // Get reference to menu confirm
  $reviewMenu.addEventListener('tab-confirm', (e)=>{ // your code here}
    // Hide review menu
    // Remove marker tracker from review content
    $reviewContent.removeAttribute("marker-tracker");
    $reviewContent.object3D.visible = false;

    // Once we've reviewed the product, add the component to our content so it's trackable"
    $productContent.setAttribute("marker-tracker", "isPromiscuous: true; lossThreshold: 3000;")
  })

  mainMarkerRef.addEventListener("tilt-side", (e)=>{ // your code here}
    $reviewMenu.components["tab-menu"].incrementSelectedIndex()
  })

  mainMarkerRef.addEventListener("tilt-forward", (e)=>{ // your code here}
    $reviewMenu.components["tab-menu"].confirmSelectedIndex()
  })

  anchorRef.addEventListener("tag-index-trigger", (e)=>{ // your code here}
    let index = e.detail.index
    $tabMenu.components["tab-menu"].selectIndex(index)
    contentFan.animateToContent(index)
  })
});





