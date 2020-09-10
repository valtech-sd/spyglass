// This component flips the coordinate frame of an object as a convenience
// It's mostly used to transform marker rotation to the rotation we perceive onscreen
// (Instead of being Y-up oriented)
AFRAME.registerComponent('smoothed-marker-tracker', {
  schema: {
    adjustedRotation: {
      type: 'vec3',
      default: { x: 0, y: 0, z: 0 }
    }
  },
  init: function () {

    this.el.object3D.isShown = false
    // Add animations for events
    this.el.setAttribute("animation__show", "property: opacity; from: 0.0; to: 1.0; dur: 500; startEvents: onShow; easing: easeOutCubic;");
    this.el.setAttribute("animation__hide", "property: opacity; from: 1.0; to: 0.0; dur: 500; startEvents: onHide; easing: easeOutCubic;");

  },
  onMarkerPositionUpdate: function(event) {

    // console.log("position update")
  },
  onMarkerRotationUpdate: function(event) {
    // console.log("rot update")
  },
  onMarkerTrackingStarted: function(event) {
    // console.log("tracking update")
    // this.el.object3D.isShown = true
    this.el.object3D.visible = true
    // this.el.emit('onShow', {}, true);
  },
  onMarkerTrackingEnded: function(event) {
    console.log("tracking update")
    this.el.object3D.visible = false;
    // this.el.object3D.isShown = false
    // this.el.emit('onHide', {}, true);
  },
  update: function () {},
  tick: function () {
  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});