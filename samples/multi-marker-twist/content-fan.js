// This component presents pieces of content as a "fan" around a cylinder
// It can be animated to rotate to each piece of content
AFRAME.registerComponent('content-fan', {
  schema: {
    radius: {
      type: 'int',
      default: 1
    },
    wiggleEnabled: {
      type: 'bool',
      default: true
    },
    maxWiggle: {
      type: 'number',
      default: 14
    }
  },
  init: function () {

    // The points of rotation for each of our pieces of content
    this.contentKeyframes = []
    this.currentContentIndex = -1
    this.angleInterval = 0

    // Variables required by our animation function
    // Anime.js must animate a property, or class variable
    this.startingRotation = 0
    this.animationActive = false
    this.animationDelta = 0

    // Add a cylinder geometry
    // Content blades will be positioned around cylinder
    // Cylinder parent will be rotated
    var core = document.createElement('a-cylinder');
    core.setAttribute("wireframe", false)
    core.setAttribute("opacity", 0)
    core.setAttribute("color", "red")
    core.setAttribute("height", 4)
    core.setAttribute("radius", this.data.radius)
    this.el.appendChild(core);

    // Build some blades on which we'll show some content
    // TODO: Make this configureable
    let numBlades = 3

    // How many degrees apart is each blade around the cylinder
    this.angleInterval = (2 * Math.PI) / numBlades

    // Create blades with some sample content
    for (var i = 0; i < numBlades; i++) {

      var currentAngle = (i * this.angleInterval)

      // TODO: This is just fake content, so I manually plugged in the aspect ratio
      // Ideally, we'll be building these panels ourselves
      let aspectRatio = 257/1153
      let planeWidth = 2
      let planeHeight = planeWidth / aspectRatio
      let dist = this.data.radius

      // Assuming we position around center
      let x = dist * Math.cos(currentAngle)
      let z = -dist * Math.sin(currentAngle)

      // We create a container so that we can adjust the anchor and pivot point
      // of the plane...A-Frame has a "pivot" component that can do this, but
      // no way to change the position anchor...this is easier for now.
      let planeContainer = document.createElement('a-entity');

      // Make a plane
      let plane = document.createElement('a-plane');

      plane.setAttribute("height", planeHeight)
      plane.setAttribute("width", planeWidth)

      // Scoot plane over so we're positioning it from the edge
      plane.object3D.position.x = planeWidth*0.5

      // Currently, this is the same for all...just a test
      plane.setAttribute("material", "src: #sample-image-thin")

      // Position plane around cylinder
      planeContainer.object3D.position.x = x
      planeContainer.object3D.position.z = z

      // Rotate so we're mostly facing the camera
      // TODO: 120 is hardcoded so maybe we'd need to adjust that? Unsure
      planeContainer.object3D.rotation.y = (currentAngle + THREE.Math.degToRad(120))

      // Save this angle to our "key frames" that we can animate to
      this.contentKeyframes.push(currentAngle)

      planeContainer.appendChild(plane)
      core.appendChild(planeContainer)
    }

    // Content should be in REVERSE order of tags
    // That way, the direction we spin the content matches the direction we detect the markers
    // TODO: This could be a param
    this.contentKeyframes.reverse()

    // Set initial rotation
    if (this.contentKeyframes.length > 0) {
      this.el.object3D.rotation.y = this.contentKeyframes[0]
      this.currentContentIndex = 0
    }
  },

  // Function is called when the currently-detected marker is "wiggled" from side to side
  // It would probably be best to animate this too, but I got lazy and wanted
  // to see how it would look just by changing the raw value
  animateContentOffset: function(offset) {
    if (this.animationActive || !this.data.wiggleEnabled) {
      return
    }

    // If wiggle amount is too large, we may want to animate this as well
    // flip direction bc
    let wiggleAmount = THREE.Math.mapLinear(offset, 1.0, 0.0, -this.data.maxWiggle, this.data.maxWiggle)

    let baseAngle = this.contentKeyframes[this.currentContentIndex]
    this.el.object3D.rotation.y = baseAngle + THREE.Math.degToRad(wiggleAmount)
  },

  // Called when a new marker is detected
  // Will rotate cylinder to a different keyframe
  animateToContent: function(index) {

    if (this.lastContentIndex == this.currentContentIndex) {
      return
    }

    // Check if this index is within our content
    if ((index >= 0) && (index < this.contentKeyframes.length)) {

      let target = this

      var targetAngle = this.contentKeyframes[index]
      var curRot = this.el.object3D.rotation.y

      var deltaRotation = targetAngle - curRot

      // Find delta in range of -PI to PI
      // We always want to rotate the minimum amount to get to the marker...(either right or left)
      // This matches what we'd do in real life
      if (deltaRotation < -Math.PI) {
        deltaRotation += 2 * Math.PI
      } else if (deltaRotation >= Math.PI) {
        deltaRotation -= 2 * Math.PI
      }

      this.currentContentIndex = index
      this.startingRotation = curRot

      // Kind of clunky, but to dynamically make an animation...
      // We animate a variable within the class...then use that to set the rotation
      var animation = AFRAME.ANIME({
        targets: target,
        animationDelta: [0, deltaRotation],
        delay: 0,
        duration: 1500,
        isRawProperty: true,
        begin: function(anim) {
          target.animationActive = true
        },
        complete: function(anim) {
          target.animationActive = false
        },
        update: function (animation) {
          target.el.object3D.rotation.y = target.startingRotation + target.animationDelta
        },
        direction: 'normal',
        loop: false,
        autoplay: false,
        easing: 'easeInOutSine'
      });

      animation.play()
    }
  },
  update: function () {},
  tick: function () {

  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});