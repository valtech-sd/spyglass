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

    this.tagElements = this.el.querySelectorAll('a-marker');

    // Add adjusted rotation to tag elements, if it doesn't already exist
    this.tagElements.forEach( function(tag) {
      tag.setAttribute("adjusted-rotation", "")
    })
  },
  lastTrackedTag: function () {
    var lastTrackedIndex = -1; // None tracked
    var lastTrackedElement = null;

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
          //
          // console.log("new starting rotation")
          // console.log(this.initialRotation)
          //
          // // Get adjusted rotaiton for our new tracked tag
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

        // console.log(lastTrackedInfo)
        // console.log(lastTag)

        // lastTag.components
        let currentRotation = lastTag.getAttribute('adjusted-rotation').adjustedRotation

        // Compute delta from starting rotation
        // Focus on "flip" rotation about y-axis

        let deltaRotationAboutY = this.initialRotation.y - currentRotation.y
        console.log("delta rotation: ", deltaRotationAboutY)
        // console.log(adjustRot)
      }



      // console.log(lastTag)

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