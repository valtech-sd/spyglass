// Register custom components before loading HTML
// TODO: This should actually be a combo of a component and a system...!
// We shouldn't do all the math in the component

AFRAME.registerComponent('content-group', {
  schema: {
    contentSpacing: {
      type: 'number',
      default: 1
    }
  },
  init: function () {
    this.spacing = this.data.contentSpacing;
    this.initLayout()
  },
  initLayout: function() {
    this.contentElements = this.el.querySelectorAll('[textwithicon]');

    console.log("content elet");
    console.log(this.contentElements);

    let self = this;

    var contentHeightSoFar = 0;
    this.contentElements.forEach( function(el, index) {
      console.log("index ", index);

      let contentComponent = el.components.textwithicon;
      let contentHeight = contentComponent.getHeight();
      console.log("content height ", contentHeight);
      console.log(self.spacing);
      el.object3D.position.y = contentHeightSoFar;

      // Content grows down
      contentHeightSoFar += -self.spacing - contentHeight;
      // console.log("content height so far: ", contentHeightSoFar);

    })
  },
  // TODO: Have some smarter way of adding data
  initializeFromData(data) {

    let self = this

    data.forEach(function (content){
      console.log(content);

      let hasTitle = content.title != null

      // Create a content element
      var contentEl = document.createElement('a-entity');

      console.log(contentEl);
      contentEl.setAttribute("textwithicon", {
        hasTitle: hasTitle,
        icon: content.icon,
        titleLabel: content.title,
        bodyLabel: content.body
      })

      self.el.appendChild(contentEl);
    })

    this.initLayout()

    console.log("initializing from data!")
  },
  update: function () {},
  tick: function () {

  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});