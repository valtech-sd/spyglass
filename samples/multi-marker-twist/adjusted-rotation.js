// Register custom components before loading HTML
// TODO: This should actually be a combo of a component and a system...!
// We shouldn't do all the math in the component
AFRAME.registerComponent('adjusted-rotation', {
  init: function () {

    console.log("adjusted rotation component initialized")
    this.adjustedRotation = new THREE.Vector3(0,0,0)
    this.updateRotation()
  },
  schema: {
    adjustedRotation: {
      type: 'vec3',
      default: { x: 0, y: 0, z: 0 }
    }
  },
  updateRotation: function() {
    let entity = this.el.object3D
    var radToDeg = THREE.Math.radToDeg;

    var transformAxisMatrix = new THREE.Matrix4();
    transformAxisMatrix.set(1, 0, 0, 0,
      0, 0, -1, 0,
      0, 1, 0, 0,
      0, 0, 0, 1);

    let adjustedRotationAxes = entity.rotation.toVector3().applyMatrix4(transformAxisMatrix)
    this.adjustedRotation = new THREE.Vector3(radToDeg(adjustedRotationAxes.x),
      radToDeg(adjustedRotationAxes.y),
      radToDeg(adjustedRotationAxes.z))

    this.data.adjustedRotation = this.adjustedRotation

  },
  update: function () {},
  tick: function () {
    this.updateRotation()
  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});