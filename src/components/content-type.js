AFRAME.registerComponent('content-type', {
  schema: {
    contentType: {
      type: 'string',
      default: ''
    }
  },
  init: function () {
    this.contentType = this.data.contentType;
  },
  contentComponentFromType() {
    return this.el.components[this.contentType];
  },
  update: function () {},
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});