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

    this.tabElements = this.el.querySelectorAll('[tabitem], [icon-tab-menu-item]');
    this.tabComponents = []
    this.spacing = this.data.tabSpacing

    this.selectedIndex = 0;
    let self = this;

    // Fetch components
    this.tabElements.forEach( function(tag, index) {
      let textTab = tag.components['tabitem'];
      let iconTab = tag.components['icon-tab-menu-item'];
      let tabComponent = (textTab) ? textTab : iconTab;

      self.tabComponents.push(tabComponent);
    });

    this.tabComponents.forEach( function(tabComponent, index) {

      let tabWidth = tabComponent.getWidth();
      console.log(tabComponent)
      tabComponent.el.object3D.position.x = tabWidth * 0.5 + index * self.data.tabSpacing

      if (index == self.selectedIndex) {
        tabComponent.select();
      } else {
        tabComponent.deselect();
      }
    })
  },
  selectIndex: function(index) {

    let self = this
    this.tabComponents.forEach( function(tabComponent, i) {
      // let tabComponent = tabEl.components.tabitem
      if (i == index) {
        self.selectedIndex = index;
        tabComponent.select();
        console.log("selecting", index)
      } else {
        tabComponent.deselect();
      }
    })
  },
  incrementSelectedIndex: function() {
    let numTabs = this.tabComponents.length
    if (numTabs > 0) {
      let indexToSelect = (this.selectedIndex + 1) % numTabs;
      this.selectIndex(indexToSelect);
    }
  },
  decrementSelectedIndex: function() {
    let numTabs = this.tabComponents.length
    if (numTabs > 0) {
      let indexToSelect = (this.selectedIndex == 0) ? numTabs - 1 : (this.selectedIndex - 1) % numTabs;
      this.selectIndex(indexToSelect);
    }
  },
  update: function () {},
  tick: function () {

  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});