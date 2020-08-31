// Register custom components before loading HTML
// TODO: This should actually be a combo of a component and a system...!
// We shouldn't do all the math in the component
AFRAME.registerComponent('rotation-trigger', {
    schema: {
        threshold: {
            type: 'int',
            default: 1.5
        },
        // TODO: SET MIN / MAX
        smoothingFactor: {
            type: 'number',
            default: 0.5
        },
        debounceTime: {
            type: 'time',
            default: 500
        }
    },
    init: function () {

        // Values used for internal calculation
        // TODO: How to just have these be set by the schema default?
        this.prevRotation = new THREE.Vector3(0,0,0)
        this.currRotationRate = new THREE.Vector3(0,0,0)
        this.prevTimestamp = -1
        this.threshold = 1.5
        this.debounceTime = 500 // ms

        // TODO: This could be nicer
        this.lastLeftRotation = -10000
        this.lastRightRotation = -10000

        // TODO: How to set to default?
        this.smoothingFactor = 0.0

        // Bind methods.js
        this.onRotateRight = AFRAME.utils.bind(this.onRotateRight, this);
        this.onRotateLeft = AFRAME.utils.bind(this.onRotateLeft, this);

        // Attach event listener.
        // We could do this outside of the component too
        this.el.addEventListener('rotated-right', this.onRotateRight);
        this.el.addEventListener('rotated-left', this.onRotateLeft);
    },
    onRotateRight: function() {
        console.log("Rotated right!")
    },
    onRotateLeft: function() {
        console.log("Rotated left!")
    },
    update: function () {},
    tick: function () {

        let entity = this.el.object3D
        var radToDeg = THREE.Math.radToDeg;

        // Only calculate rotation when entity is visible
        if (entity.visible) {

            var transformAxisMatrix = new THREE.Matrix4();
            transformAxisMatrix.set( 1, 0, 0, 0,
                0, 0, -1, 0,
                0, 1, 0, 0,
                0, 0, 0, 1 );

            // Transform the marker's rotation axis so that it
            // matches the coordinate frame of the scene
            let adjustedRotation = entity.rotation.toVector3().applyMatrix4(transformAxisMatrix)

            let rotationDegrees = new THREE.Vector3(radToDeg(adjustedRotation.x),
                radToDeg(adjustedRotation.y),
                radToDeg(adjustedRotation.z))

            let s = "x: " + rotationDegrees.x + ", y: " + rotationDegrees.y + ", z: " + rotationDegrees.z
            // console.log(s)

            // Get timestamp
            let currTimestamp = Date.now()  // convert to
            let deltaTimestamp = (this.prevTimestamp == -1) ? 0 : Math.abs(currTimestamp - this.prevTimestamp)

            // Calculate rotation delta (z-axis)
            if (deltaTimestamp > 0) {

                let deltaTimestampVec = new THREE.Vector3().addScalar(deltaTimestamp)
                let smoothingFactorVec = new THREE.Vector3().addScalar(this.smoothingFactor)

                // Account for angle rollover (0-360)
                // If delta is way too big, adjust it
                let clampDelta = function(rawDelta) {
                    if (rawDelta.x > 180) { rawDelta.x -= 360 } else if (rawDelta.x < -180) { rawDelta.x += 360 }
                    if (rawDelta.y > 180) { rawDelta.y -= 360 } else if (rawDelta.y < -180) { rawDelta.y += 360 }
                    if (rawDelta.z > 180) { rawDelta.z -= 360 } else if (rawDelta.z < -180) { rawDelta.z += 360 }

                    return rawDelta
                }

                // We must use vec3 functions; operators are not overloaded...
                let rotationDelta = clampDelta(rotationDegrees.sub(this.prevRotation))
                let rotationRate = rotationDelta.divide(deltaTimestampVec)

                // Smooth out the rate of rotation
                let weightedHistory = smoothingFactorVec.multiply(this.currRotationRate)
                let weightedCurrent = new THREE.Vector3(1.0, 1.0, 1,0).sub(smoothingFactorVec).multiply(rotationRate)
                this.currRotationRate = weightedHistory.add(weightedCurrent)

                // TODO: Can also look for rotation about X and Z, but they will
                // probably need their own theshholds (harder to rotate on these axes without
                // losing marker tracking
                if (Math.abs(this.currRotationRate.z) >= this.threshold) {

                    let currTime = Date.now() //millis

                    // Rotated left
                    if (this.currRotationRate.z < 0) {

                        if (currTime - this.lastLeftRotation > this.debounceTime) {
                            this.lastLeftRotation = currTime
                            this.el.emit("rotated-left");
                            // this.onRotatedLeft()
                        }

                        // Rotated right
                    } else {
                        if (currTime - this.lastRightRotation > this.debounceTime) {
                            this.lastRightRotation = currTime
                            this.el.emit("rotated-right");
                            // this.onRotatedRight()
                        }
                    }
                }
            }

            this.prevTimestamp = currTimestamp
            this.prevRotation = rotationDegrees

        } else {
            // Reset timestamp if entity is not visible
            this.prevTimestamp = -1
            this.currRotationRate.set(0, 0, 0)
        }
    },
    remove: function () {},
    pause: function () {},
    play: function () {}
});