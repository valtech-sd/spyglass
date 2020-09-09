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

    // For now, we're just looking for entities with textwithicon components
    this.contentElements = this.el.querySelectorAll('[textwithicon]');

    this.spacing = this.data.contentSpacing;

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
  update: function () {},
  tick: function () {

  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});