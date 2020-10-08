export default data => {
  // Build content panels with "data"
  var panel = document.createElement('a-entity');
  panel.setAttribute("content-group", "");

  let content = panel.components['content-group'];
  content.initializeFromData(data);

  return panel
};