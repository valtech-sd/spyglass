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

    this.minTrackDuration = 100 // how long we must track a new marker for before we transition
    this.startTrackTime = -1 // when we started tracking the current marker
    this.emittedIndexEvent = false

    this.trackerLostThreshold = 3000
    this.lastTrackedTime = -1

    this.prevTrackedIndex = -1
    this.prevTrackedElement = null
    this.rotationDelta = 0
    this.minRotation = -50
    this.maxRotation = 50

    this.isTracking = false;

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
    var emitTrackingStart = false;

    this.tagElements.forEach(function (tag, index) {
      let entity = tag.object3D

      if (entity.visible) {

        self.startTrackTime = Date.now()
        self.lastTrackedTime = Date.now()
        lastTrackedIndex = index
        lastTrackedElement = tag

        // This is our first tracked tag
        if (!self.isTracking) {
          emitTrackingStart = true;
        }

        if (this.prevTrackedIndex != lastTrackedIndex) {

          // start our time
          self.emittedIndexEvent = false;
          // let currTimestamp = Date.now()  // convert to
          // let deltaTimestamp = (this.prevTimestamp == -1) ? 0 : Math.abs(currTimestamp - this.prevTimestamp)


          // let adjustRot = lastTrackedElement.getAttribute('adjusted-rotation')
          //
          // // Calculate and emit event for last tag tracked
          // this.initialRotation = adjustRot.adjustedRotation
          // self.el.emit("tag-index-trigger", { index: lastTrackedIndex });
        } else {

          if (!self.emittedIndexEvent) {
            let currentTime = Date.now()
            let deltaTimestamp = (self.startTrackTime == -1) ? 0 : Math.abs(currentTime - self.startTrackTime)

            if (deltaTimestamp > self.minTrackDuration){
              self.el.emit("tag-index-trigger", { index: lastTrackedIndex });
              self.emittedIndexEvent = true
            }
          }
        }

        if (emitTrackingStart) {
          self.isTracking = true;
          self.el.emit("tracking-started", { index: lastTrackedIndex });
        }

        this.prevTrackedIndex = lastTrackedIndex
        this.prevTrackedElement = lastTrackedElement
      }
    })

    if (lastTrackedElement == null && this.lastTrackedTime != null) {

      let currentTime = Date.now()
      let deltaTimestamp = Math.abs(currentTime - this.lastTrackedTime)

      if ((deltaTimestamp > this.trackerLostThreshold) && this.isTracking) {
        self.lastTrackedIndex = -1;
        this.isTracking = false;
        self.el.emit("tracking-ended", { index: lastTrackedIndex });
      }
    }
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

      if (lastTag && this.emittedIndexEvent) {
        // Get adjusted rotation
        let currentRotation = lastTag.getAttribute('adjusted-rotation').adjustedRotation
        let currentPosition = lastTag.getAttribute("position")

        // Compute delta from starting rotation
        // Focus on "flip" rotation about y-axis
        let deltaRotationAboutY = this.initialRotation.y - currentRotation.y

        // Compute normalized value of rotation, clamping to min/max rotation
        let clampedRotation = THREE.Math.clamp(deltaRotationAboutY, this.minRotation, this.maxRotation)
        let normalizedRotation = THREE.Math.mapLinear(clampedRotation, this.minRotation, this.maxRotation, 0, 1)

        // this.el.emit("tag-rotation", { index: lastTrackedInfo.index, normalizedRotation: normalizedRotation });
        this.el.emit("tag-rotation", { index: lastTrackedInfo.index, rotation: currentRotation });
        this.el.emit("tag-position", { index: lastTrackedInfo.index, position: currentPosition });

      }
    }

  },
  remove: function () {},
  pause: function () {},
  play: function () {}
})