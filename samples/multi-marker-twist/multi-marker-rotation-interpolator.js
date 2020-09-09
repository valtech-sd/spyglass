// This could be cleaned up more, but we can do that later
// This class will take a group of indices and emit the index
// of the current marker that's being detected
// (or the largest index if multiple markers are detected)

// It will also calculate a wiggle amount if the current marker
// is rotated slightly about the y-axis
AFRAME.registerComponent('multi-marker-rotation-interpolator', {
  init: function () {

    this.tagElements = [];
    this.initialRotation = new THREE.Vector3(0,0,0)

    this.prevTrackedIndex = -1
    this.prevTrackedElement = null
    this.rotationDelta = 0
    this.minRotation = -50
    this.maxRotation = 50

    // Find all of the tags in this group
    this.tagElements = this.el.querySelectorAll('a-marker');

    // Add adjusted rotation component to tag elements, if it doesn't already exist
    // This transforms the tag's coordinate frame to match what we see on camera
    this.tagElements.forEach( function(tag) {
      tag.setAttribute("adjusted-rotation", "")
    })

    // Set up event handlers
    this.onTagIndexTrigger = AFRAME.utils.bind(this.onTagIndexTrigger, this);
    this.onTagRotation = AFRAME.utils.bind(this.onTagRotation, this);

    this.el.addEventListener('tag-index-trigger', this.onTagIndexTrigger);
    this.el.addEventListener('tag-rotation', this.onTagRotation);
  },
  onTagIndexTrigger: function(e) {
    // Emit the index of the tag that was detected
    let index = e.detail.index
  },
  onTagRotation: function(e) {

    // Emit a normalized rotation amount if the current
    // tag is rotated about the y-index
    let index = e.detail.index
    let normRot = e.detail.normalizedRotation
  },
  lastTrackedTag: function () {

    // Figures out which tag in the group is being tracked
    // Or...if multiple tags are tracked, the largest index
    var lastTrackedIndex = -1; // None tracked
    var lastTrackedElement = null;

    let self = this

    this.tagElements.forEach(function (tag, index) {
      let entity = tag.object3D

      if (entity.visible) {
        lastTrackedIndex = index
        lastTrackedElement = tag

        if (this.prevTrackedIndex != lastTrackedIndex) {
          let adjustRot = lastTrackedElement.getAttribute('adjusted-rotation')

          // Calculate and emit event for last tag tracked
          this.initialRotation = adjustRot.adjustedRotation
          self.el.emit("tag-index-trigger", { index: lastTrackedIndex });
        }

        this.prevTrackedIndex = lastTrackedIndex
        this.prevTrackedElement = lastTrackedElement
      }
    })
    return { index: lastTrackedIndex, element: lastTrackedElement }
  }
  ,
  update: function () {},
  tick: function () {

    let entity = this.el.object3D

    if (entity.visible) {

      let lastTrackedInfo = this.lastTrackedTag()

      // Figure out last tag visible
      let lastTag = this.lastTrackedTag().element

      if (lastTag) {
        // Get adjusted rotation
        let currentRotation = lastTag.getAttribute('adjusted-rotation').adjustedRotation

        // Compute delta from starting rotation
        // Focus on "flip" rotation about y-axis
        let deltaRotationAboutY = this.initialRotation.y - currentRotation.y

        // Compute normalized value of rotation, clamping to min/max rotation
        let clampedRotation = THREE.Math.clamp(deltaRotationAboutY, this.minRotation, this.maxRotation)
        let normalizedRotation = THREE.Math.mapLinear(clampedRotation, this.minRotation, this.maxRotation, 0, 1)

        this.el.emit("tag-rotation", { index: lastTrackedInfo.index, normalizedRotation: normalizedRotation });
      }
    }

  },
  remove: function () {},
  pause: function () {},
  play: function () {}
})