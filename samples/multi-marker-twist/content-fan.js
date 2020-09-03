// Register custom components before loading HTML
// TODO: This should actually be a combo of a component and a system...!
// We shouldn't do all the math in the component
AFRAME.registerComponent('content-fan', {
  schema: {
    radius: {
      type: 'int',
      default: 1
    },
    tweener: {
      type: 'number',
      default: 0
    }
  },
  init: function () {
    console.log("content fan component initialized")

    this.test = 50

    // Add a cylinder geometry for debugging
    var core = document.createElement('a-cylinder');
    core.setAttribute("wireframe", true)
    core.setAttribute("color", "red")
    core.setAttribute("height", 4)
    core.setAttribute("radius", this.data.radius)
    this.el.appendChild(core);

    // this.root = core

    // Build some blades
    let numBlades = 3

    // Add blades that are children of the cylinder and positioned around it
    // Should be normal to the cylinder

    var angleInterval = (2 * Math.PI) / numBlades

    for (var i = 0; i < numBlades; i++) {

      var currentAngle = i * angleInterval

      let planeWidth = 3
      let dist = this.data.radius

      // Assuming we position around center
      var x = dist * Math.cos(currentAngle)
      var z = -dist * Math.sin(currentAngle)

      var planeContainer = document.createElement('a-entity');

      // Make a plane
      var plane = document.createElement('a-plane');
      // plane.setAttribute("color", "green")
      plane.setAttribute("height", 4)
      plane.setAttribute("width", planeWidth)
      plane.object3D.position.x = planeWidth*0.5

      if (i == 0) {
        plane.setAttribute("material", "side: double; color: blue")
      } else if (i == 1) {
        plane.setAttribute("material", "side: double; color: green")
      } else {
        plane.setAttribute("material", "side: double; color: red")
      }

      planeContainer.object3D.position.x = x
      planeContainer.object3D.position.z = z

      planeContainer.object3D.rotation.y = currentAngle + THREE.Math.degToRad(120)
        // - THREE.Math.degToRad(60)

      planeContainer.appendChild(plane)
      core.appendChild(planeContainer)
    }
  },
  animateToContent: function(index) {

    // TODO: check if this index is within our content
    var angleInterval = (2 * Math.PI) / 3
    let angle = angleInterval * index // in radians

    console.log(this.el.object3D)
    // this.el.object3D.rotation.y = angle

    console.log("going to try to animate to ", index)

    let target = this
    let curRot = this.el.object3D.rotation.y

    // This is noooot ideal
    var animation = AFRAME.ANIME({
      targets: target,
      test: [curRot, angle],
      delay: 0,
      duration: 1500,
      isRawProperty: true,
      update: function (animation) {

        console.log('test')
        console.log(target.test)
        console.log(animation.progress)

        var value = animation.animatables[0].target
        console.log(value)
        target.el.object3D.rotation.y = target.test
      },
      direction: 'normal',
      loop: false,
      autoplay: false,
      easing: 'easeInOutSine'
    });

    animation.property = "object3D.position.z"
    animation.to = 200

    animation.play()
  },
  update: function () {},
  tick: function () {

  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});