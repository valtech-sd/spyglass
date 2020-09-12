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
      default: 1000
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
    console.log("initializing marker trax")
    console.log(this.data)
    this.trackedMarkers = []

    if (this.isPromiscuous) {
      console.log("we're prom")
      let allMarkers = document.querySelectorAll('a-marker');
      this.trackedMarkers = allMarkers;
    } else if (this.marker !== "") {
      let markerElement = document.getElementById(this.marker);
      if (markerElement !== null) {
        console.log("adding marker for tracking: ", markerElement)
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
    this.trackedMarkers.forEach(function(markerElement) {
      if (markerElement.object3D.visible == true) {
        isVisible = true
        positionToApply = markerElement.object3D.position.clone();
      }
    });

    if (positionToApply != null) {
      let origin = this.positionOffset.clone()
      let markerPos = positionToApply

      if (!this.data.visibilityOnly) {
        this.el.object3D.position.x = origin.x + markerPos.x
        this.el.object3D.position.y = origin.y + markerPos.y
        this.el.object3D.position.z = origin.z + markerPos.z
      }

      // We don't want to set z from all markers...esp if they're different sizes!
      // if (!this.isPromiscuous) {
      //   this.el.object3D.position.z = origin.z + markerPos.z
      // } else {
      //   this.el.object3D.position.z = origin.z + this.constantZ
      // }

    } else {
      this.el.object3D.position = this.positionOffset.clone()
    }

    // If it's a visibility trigger only, do not hide when marker is lost
    if (this.data.visibilityTrigger) {
      if (isVisible){
        this.el.object3D.visible = true;
      }
    } else {
      this.el.object3D.visible = isVisible;
    }
  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});