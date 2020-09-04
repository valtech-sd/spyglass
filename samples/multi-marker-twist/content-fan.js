// Register custom components before loading HTML
// TODO: This should actually be a combo of a component and a system...!
// We shouldn't do all the math in the component
AFRAME.registerComponent('content-fan', {
  schema: {
    radius: {
      type: 'int',
      default: 1
    }
  },
  init: function () {

    this.contentKeyframes = []
    this.currentContentIndex = -1
    this.angleInterval = 0
    this.startingRotation = 0
    this.test = 50

    // Add a cylinder geometry for debugging
    var core = document.createElement('a-cylinder');
    core.setAttribute("wireframe", false)
    core.setAttribute("opacity", 0)
    core.setAttribute("color", "red")
    core.setAttribute("height", 4)
    core.setAttribute("radius", this.data.radius)
    this.el.appendChild(core);

    // Build some blades
    let numBlades = 3

    // Add blades that are children of the cylinder and positioned around it
    this.angleInterval = (2 * Math.PI) / numBlades

    for (var i = 0; i < numBlades; i++) {

      var currentAngle = (i * this.angleInterval)

      let planeWidth = 3.4*2
      let dist = this.data.radius

      // Assuming we position around center
      let x = dist * Math.cos(currentAngle)
      let z = -dist * Math.sin(currentAngle)

      let planeContainer = document.createElement('a-entity');

      // Make a plane
      let plane = document.createElement('a-plane');

      plane.setAttribute("height", 4*2)
      plane.setAttribute("width", planeWidth)
      plane.object3D.position.x = planeWidth*0.5

      // Currently, this is the same for all
      plane.setAttribute("material", "src: #sample-image")

      planeContainer.object3D.position.x = x
      planeContainer.object3D.position.z = z

      planeContainer.object3D.rotation.y = (currentAngle + THREE.Math.degToRad(120))
      this.contentKeyframes.push(currentAngle)

      planeContainer.appendChild(plane)
      core.appendChild(planeContainer)
    }

    // Content should be in REVERSE order of tags
    this.contentKeyframes.reverse()

    if (this.contentKeyframes.length > 0) {
      console.log("First angle is ", this.contentKeyframes[0])
      this.el.object3D.rotation.y = this.contentKeyframes[0]
      this.currentContentIndex = 0
    }
  },
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
      if (deltaRotation < -Math.PI) {
        deltaRotation += 2 * Math.PI
      } else if (deltaRotation >= Math.PI) {
        deltaRotation -= 2 * Math.PI
      }

      this.currentContentIndex = index
      this.startingRotation = curRot

      // This is noooot ideal
      var animation = AFRAME.ANIME({
        targets: target,
        test: [0, deltaRotation],
        delay: 0,
        duration: 1500,
        isRawProperty: true,
        update: function (animation) {
          var value = animation.animatables[0].target
          target.el.object3D.rotation.y = target.startingRotation + target.test
        },
        direction: 'normal',
        loop: false,
        autoplay: false,
        easing: 'easeInOutSine'
      });

      animation.property = "object3D.position.z"
      animation.to = 200

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