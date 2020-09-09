// Register custom components before loading HTML
// TODO: This should actually be a combo of a component and a system...!
// We shouldn't do all the math in the component

AFRAME.registerComponent('tab-menu', {
  schema: {
    tabSpacing: {
      type: 'number',
      default: 4.25
    }
  },
  init: function () {

    this.tabElements = this.el.querySelectorAll('[tabitem]');

    let children = this.el.querySelectorAll('[tabitem]');
    this.spacing = this.data.tabSpacing

    console.log("children are");
    console.log(children);

    this.selectedIndex = 0;
    let self = this;

    this.tabElements.forEach( function(tag, index) {
      console.log("index ", index)

      let tabComponent = tag.components.tabitem
      let tabWidth = tabComponent.getWidth();
      tag.object3D.position.x = tabWidth * 0.5 + index * self.data.tabSpacing

      if (index == self.selectedIndex) {
        tabComponent.select();
      } else {
        tabComponent.deselect();
      }

      // tag.setAttribute("adjusted-rotation", "")
    })
  },
  selectIndex: function(index) {
    let self = this
    this.tabElements.forEach( function(tabEl, i) {
      let tabComponent = tabEl.components.tabitem
      if (i == index) {
        tabComponent.select()
      } else {
        tabComponent.deselect()
      }
    })
  },
  update: function () {},
  tick: function () {

  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});