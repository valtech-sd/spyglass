// This component flips the coordinate frame of an object as a convenience
// It's mostly used to transform marker rotation to the rotation we perceive onscreen
// (Instead of being Y-up oriented)
AFRAME.registerComponent('marker-tracker', {
  schema: {
    marker: {
      type: 'string',
      default: ""
    },
    visibilityOnly: {
      type: 'boolean',
      default: false
    },
    visibilityTrigger: {
      type: 'boolean',
      default: false
    },
    isPromiscuous: {
      type: 'boolean',
      default: false
    },
    lossThreshold: {
      type: 'number',
      default: 500
    }
  },
  init: function () {
    this.el.object3D.isShown = false
    this.marker = this.data.marker

    this.lossThreshold = this.data.lossThreshold
    this.lossTime = null

    // These could be settings
    this.constantZ = -10; // for promiscuous mode

    this.isPromiscuous = this.data.isPromiscuous

    this.trackedMarkers = []

    if (this.isPromiscuous) {
      let allMarkers = document.querySelectorAll('a-marker');
      this.trackedMarkers = allMarkers;
    } else if (this.marker !== "") {
      let markerElement = document.getElementById(this.marker);
      if (markerElement !== null) {
        this.trackedMarkers.push(markerElement)
        this.markerElement = markerElement;
      }
    }

    this.positionOffset = this.el.object3D.position.clone()
  },
  update: function () {},
  tick: function () {

    let isVisible = false;
    let positionToApply = null;
    let isMainMarker = false;

    let trackedIndex = null;
    this.trackedMarkers.forEach(function(markerElement, index) {
      if (markerElement.object3D.visible == true) {
        isVisible = true;
        this.lossTime = null;

        // AR.js doesn't properly use its "size" property, so we do it here instead:
        let size = markerElement.getAttribute("size");
        let scalarAmount = size
        positionToApply = markerElement.object3D.position.clone().multiplyScalar(size);
        trackedIndex = index;
      }
    });

    if (positionToApply != null) {
      let origin = this.positionOffset.clone()
      let updatedPosition = this.el.object3D.position.clone();
      let positionChange = new THREE.Vector3(0,0,0);
      let markerPos = positionToApply

      if (!this.data.visibilityOnly) {

        updatedPosition.x = origin.x + markerPos.x
        updatedPosition.z = origin.z + markerPos.z

        // Kind of a hack, but don't update y position since we printed
        // the markers at different height on our label
        if (trackedIndex == 0) {
          updatedPosition.y = origin.y + markerPos.y
        }

        let smoothAmount = 0.3
        let weightedCurrentPos = this.el.object3D.position.clone().multiplyScalar(smoothAmount);
        let weightedUpdatedPos = updatedPosition.clone().multiplyScalar(1.0 - smoothAmount);
        let smoothedResult = weightedCurrentPos.add(weightedUpdatedPos);

        // this.el.object3D.position.copy(updatedPosition);
        this.el.object3D.position.copy(smoothedResult);
      }

    } else {
      this.el.object3D.position = this.positionOffset.clone()
    }

    let exceededMarkerLossThreshold = false;
    if (!isVisible) {
      if (this.lossTime == null) {
        this.lossTime = Date.now();
      } else {

        let currentTime = Date.now();
        let delta = Math.abs(currentTime - this.lossTime);

        if (delta > this.lossThreshold) {
          exceededMarkerLossThreshold = true;
        }
      }
    }

    // If we're using the marker as a visibility trigger, show once we find a marker
    // Otherwise, don't hide unless we've exceeded our marker loss threshold in seconds
    if (isVisible){
      this.lossTime = null;
      this.el.object3D.visible = true;
    } else if (!this.data.visibilityTrigger && exceededMarkerLossThreshold) {
      this.el.object3D.visible = false;
      this.lossTime = null;
    }
  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});