// Register custom components before loading HTML
// TODO: This should actually be a combo of a component and a system...!
// We shouldn't do all the math in the component

AFRAME.registerComponent('tabitem', {
  schema: {
    iconImage: {
      type: 'string',
      default: '#benefits'
    },
    textLabel: {
      type: 'string',
      default: 'hello'
    },
    textStyle: {
      type: 'string',
      default: 'hello'
    },
    isSelected: {
      type: 'boolean',
      default: true
    }
  },
  init: function () {

    this.isSelected = this.data.isSelected

    var icon = document.createElement('a-image');
    icon.setAttribute("src", this.data.iconImage)
    icon.setAttribute("width", 2);
    icon.setAttribute("height", 2);
    icon.setAttribute("animation__1", "property: opacity; from: 0.4; to: 1.0; dur: 300; startEvents: onSelect; easing: easeOutCubic;");
    icon.setAttribute("animation__2", "property: opacity; from: 1.0; to: 0.4; dur: 300; startEvents: onDeselect; easing: easeOutCubic;");
    this.el.appendChild(icon);

    var text = document.createElement('a-text');
    text.setAttribute('mixin', "menu-text");
    text.setAttribute('value', this.data.textLabel);
    text.setAttribute('position', '0 -1.65 0');
    text.setAttribute("animation__1", "property: opacity; from: 0.0; to: 1.0; dur: 300; startEvents: onSelect; easing: easeOutCubic;");
    text.setAttribute("animation__2", "property: opacity; from: 1.0; to: 0.0; dur: 300; startEvents: onDeselect; easing: easeOutCubic;");

    this.el.appendChild(text)

    // Compute width
    // TODO: Also include text size
    // let textAttr = text.components.value
    //
    // let textWidth = text.getAttribute("value")
    //   //.data.length
    //   //* (textAttr.data.width / textAttr.data.wrapCount);
    // this.width = Math.max(icon.getAttribute("width"), textWidth);
    this.width = icon.getAttribute("width")

    this.text = text
    this.icon = icon
  },
  onTabSelected: function(data) {
    console.log("on tab selected", data.detail.tabName)

    if (data.detail.tabName) {
      if (data.detail.tabName === this.data.textLabel) {
        this.select()
      } else {
        this.deselect()
      }
    }
  },
  getWidth: function() {
    console.log("width is ", this.width);
    return this.width;
  },
  select: function() {
    if (!this.isSelected) {
      this.isSelected = true
      this.icon.emit('onSelect', {}, true);
      this.text.emit('onSelect', {}, true);
    }
  },
  deselect: function() {
    if (this.isSelected) {
      this.isSelected = false
      this.text.emit('onDeselect', {}, true);
      this.icon.emit('onDeselect', {}, true);
    }
  },
  confirm: function() {

  },
  update: function () {},
  tick: function () {

  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});