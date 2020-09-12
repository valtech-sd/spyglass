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

ready(function() {
  console.log( "DOM loaded" );

  let usageType = "textwithicon"
  let usageData = [
    {
      icon: "#step1",
      title: null,
      body: "Cleanse and tone head and neck.",
      type: usageType
    }, {
      icon: "#step2",
      title: null,
      body: "Measure out 1/2 teaspoon of serum.",
      type: usageType
    }, {
      icon: "#step3",
      title: null,
      body: "Massage into skin twice daily.",
      type: usageType
    }];

  let benefitsType = "textwithicon"
  let benefitsData = [
    {
      icon: "#ylangylang",
      title: "YLANG YLANG",
      body: "Sweet, exotic and floral, essential oil distilled from the fragrant flowers..",
      type: benefitsType
    }, {
      icon: "#panthenol",
      title: "PANTHENOL",
      body: "Also called B5 Vitamin, moisturizes the skin.",
      type: benefitsType
    }];

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
  contentFan.buildWithContentElements([makePanel(benefitsData), makePanel(usageData), makePanel(benefitsData)]);

  var anchorRef = document.getElementById('twistParent');

  anchorRef.addEventListener("tag-index-trigger", (e)=>{ // your code here}
    let index = e.detail.index
    $tabMenu.components["tab-menu"].selectIndex(index)
    contentFan.animateToContent(index)
  })
});





