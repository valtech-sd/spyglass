AFRAME.registerSystem('multi-marker-rotation-system', {
  schema: {},  // System schema. Parses into `this.data`.

  init: function () {
    // Called on scene initialization.

    // We will collect all
    this.tags = [];
  },

  // Other handlers and methods.
});

// Parent component of a rotation group
AFRAME.registerComponent('multi-marker-rotation-interpolator', {
  init: function () {

    console.log("Registering rotation component")
    console.log(this.system);

    this.tagElements = [];
    this.useRotation = false
    this.initialRotation = new THREE.Vector3(0,0,0)

    this.prevTrackedIndex = -1
    this.prevTrackedElement = null
    this.rotationDelta = 0
    this.minRotation = -50
    this.maxRotation = 50

    this.tagElements = this.el.querySelectorAll('a-marker');

    // Add adjusted rotation to tag elements, if it doesn't already exist
    this.tagElements.forEach( function(tag) {
      tag.setAttribute("adjusted-rotation", "")
    })

    this.onTagIndexTrigger = AFRAME.utils.bind(this.onTagIndexTrigger, this);
    this.onTagRotation = AFRAME.utils.bind(this.onTagRotation, this);

    // Attach event listener.
    // We could do this outside of the component too
    this.el.addEventListener('tag-index-trigger', this.onTagIndexTrigger);
    this.el.addEventListener('tag-rotation', this.onTagRotation);
  },
  onTagIndexTrigger: function(e) {
    console.log("Tag index trigger!")

    let index = e.detail.index
    console.log(index)
  },
  onTagRotation: function(e) {
    console.log("Tag rotation!")

    let index = e.detail.index
    let normRot = e.detail.normalizedRotation

    console.log("Tag rotation!")
    console.log(index)
    console.log(normRot)
  },
  lastTrackedTag: function () {
    var lastTrackedIndex = -1; // None tracked
    var lastTrackedElement = null;

    let self = this

    this.tagElements.forEach(function (tag, index) {
      let entity = tag.object3D

      if (entity.visible) {
        lastTrackedIndex = index
        lastTrackedElement = tag

        if (this.prevTrackedIndex != lastTrackedIndex) {
          console.log("switched tags!")

          let adjustRot = lastTrackedElement.getAttribute('adjusted-rotation')

          // Update rotation offset
          this.initialRotation = adjustRot.adjustedRotation

          self.el.emit("tag-index-trigger", { index: lastTrackedIndex });
        }

        this.prevTrackedIndex = lastTrackedIndex
        this.prevTrackedElement = lastTrackedElement
      }
    })

    return { index: lastTrackedIndex, element: lastTrackedElement }
    // console.log("last tracked tag", lastTrackedTag)
  }
  ,
  update: function () {


  },
  tick: function () {

    let entity = this.el.object3D

    if (entity.visible) {

      let lastTrackedInfo = this.lastTrackedTag()

      // Figure out last tag visible
      let lastTag = this.lastTrackedTag().element

      if (lastTag) {

        // lastTag.components
        let currentRotation = lastTag.getAttribute('adjusted-rotation').adjustedRotation

        // Compute delta from starting rotation
        // Focus on "flip" rotation about y-axis
        let deltaRotationAboutY = this.initialRotation.y - currentRotation.y

        // Compute normalized value of rotation, clamping to min/max rotation
        // mapLinear
        let clampedRotation = THREE.Math.clamp(deltaRotationAboutY, this.minRotation, this.maxRotation)
        let normalizedRotation = THREE.Math.mapLinear(clampedRotation, this.minRotation, this.maxRotation, 0, 1)
        console.log("normalized rotation: ", normalizedRotation)

        this.el.emit("tag-rotation", { index: lastTrackedInfo.index, normalizedRotation: normalizedRotation });
      }
    }

  },
  remove: function () {},
  pause: function () {},
  play: function () {}
})

AFRAME.registerComponent('rotation-interpolator-item', {
  init: function () {
    console.log(this.system);
  },
  update: function () {},
  tick: function () {},
  remove: function () {},
  pause: function () {},
  play: function () {}
});