// Register custom components before loading HTML
// TODO: This should actually be a combo of a component and a system...!
// We shouldn't do all the math in the component

AFRAME.registerComponent('icon-tab-menu-item', {
  schema: {
    iconImage: {
      type: 'string',
      default: '#benefits'
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
    icon.setAttribute("side", "front");

    icon.setAttribute("animation__1", "property: opacity; from: 0.4; to: 1.0; dur: 300; startEvents: onSelect; easing: easeOutCubic;");
    icon.setAttribute("animation__2", "property: opacity; from: 1.0; to: 0.4; dur: 300; startEvents: onDeselect; easing: easeOutCubic;");
    icon.setAttribute("animation__3", "property: color; from: #FFF; to: #74fab9; dur: 500; startEvents: onConfirm; easing: easeOutCubic;");

    this.el.appendChild(icon);

    var underline = document.createElement('a-plane');
    underline.setAttribute("width", 1.5);
    underline.setAttribute("height", 0.25);
    underline.setAttribute("position", "0.0 -1.5 0");
    underline.setAttribute("animation__1", "property: opacity; from: 0.0; to: 1.0; dur: 300; startEvents: onSelect; easing: easeOutCubic;");
    underline.setAttribute("animation__2", "property: opacity; from: 1.0; to: 0.0; dur: 300; startEvents: onDeselect; easing: easeOutCubic;");

    //We should technically reset this confirm color when we're done...but we're only going to do it once
    underline.setAttribute("animation__3", "property: color; from: #FFF; to: #74fab9; dur: 500; startEvents: onConfirm; easing: easeOutCubic;");

    this.el.appendChild(underline);

    this.underline = underline
    this.icon = icon

    if (this.isSelected) {
      underline.setAttribute("opacity", 1.0);
      icon.setAttribute("opacity", 1.0);
    } else {
      underline.setAttribute("opacity", 0);
      icon.setAttribute("opacity", 0.4);
    }

    this.width = icon.getAttribute("width")
  },
  getWidth: function() {
    console.log("width is ", this.width);
    return this.width;
  },
  select: function() {
    if (!this.isSelected) {
      this.isSelected = true
      this.icon.emit('onSelect', {}, true);
      this.underline.emit('onSelect', {}, true);
    }
  },
  deselect: function() {
    if (this.isSelected) {
      this.isSelected = false
      this.icon.emit('onDeselect', {}, true);
      this.underline.emit('onDeselect', {}, true);
    }
  },
  confirm: function() {
    // Must be selected
    if (this.isSelected) {
      this.icon.emit('onConfirm', {}, true);
      this.underline.emit('onConfirm', {}, true);
    }
  },
  update: function () {},
  tick: function () {

  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});