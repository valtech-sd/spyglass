// This component flips the coordinate frame of an object as a convenience
// It's mostly used to transform marker rotation to the rotation we perceive onscreen
// (Instead of being Y-up oriented)
AFRAME.registerComponent('marker-tracker', {
  schema: {
    marker: {
      type: 'string',
      default: ""
    }
  },
  init: function () {
    this.el.object3D.isShown = false
    this.marker = this.data.marker

    console.log("initializing tracker")
    this.markerElement = document.getElementById(this.marker);
    this.positionOffset = this.el.object3D.position.clone()
  },
  update: function () {},
  tick: function () {

    if (this.markerElement.object3D.visible == true) {

      let origin = this.positionOffset.clone()
      let markerPos = this.markerElement.object3D.position.clone()

      this.el.object3D.position.x = origin.x + markerPos.x
      this.el.object3D.position.y = origin.y + markerPos.y
      this.el.object3D.position.z = origin.z + markerPos.z

      this.el.object3D.visible = true

    }else {
      this.el.object3D.position = this.positionOffset.clone()
      this.el.object3D.visible = false
    }
  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});