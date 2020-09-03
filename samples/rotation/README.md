# Rotation Example

This example shows a demo of using a single marker to detect rotation events. We detect rotation events in the x, y, and z axis. When a sufficient change in the rate of rotate has been detected, we emit the following events:

*  `tilt-side` --> Emitted when marker is rotated side-to-side (about Z-axis)
*  `tilt-forward`--> Emitted when marker is rotated front-to-back (about X-axis)
*  `twist`--> Emitted when marker is "twisted" (rotated about Y-axis)

Download and print the [Hiro marker here](https://github.com/jeromeetienne/AR.js/blob/master/data/images/HIRO.jpg).

![Tilt interaction sketch](../../readmeImages/tilt.png)

## To run the example

From the repository root, run `npm run dev:rotation`

## Files
* `rotation-marker.html`
     -  Sets up the basic A-Frame scene that tracks a Hiro marker and displays a cube and animating torus
     -  Includes required scripts
     -  Includes stubs for responding to different animation events with a simple color change
* `rotation-trigger.js`
     -  A custom A-Frame component that emits events if the marker is rotated about any axis
* `rotation.js`
     -  Simple js file that adds event handlers to `markerFound`, `markerLost`
     -  Also adds event handlers for our custom events, `rotated-left` and `rotated-right`

## How does it work?

(More to be added)

We calculate the change in the marker's rotation frame-to-frame and calculate a "rotation rate" for each axis. If the rotation rate exceeds a certain threshold, we will emit a rotation events. Currently, we only emit events for rotation on the Z-axis, but this could easily be extended.

We also apply basic smoothing and debouncing to our event detection. These can be tuned to your heart's desire.

## A-Frame attributes

*  `tiltSideThreshold` --> Rotation rate threshold for "tilt side" event detection
*  `tiltForwardThreshold`--> Rotation rate threshold for "tilt forward" event detection
*  `twistThreshold`--> Rotation rate threshold for "twist" event detection
*  `smoothingFactor`--> (0-1) How much smoothing we apply to our calculated rotation rate. A low smoothing value means that we allow instantaneous, noisy rotation changes to trigger events. A higher value means we increasingly filter out noise (but it may take more rotation to trigger an event).
*  `debounceTime`--> Amount of time we block event emission after an event has been detected


## How do I run this on mobile?
Follow the ngrok instructions in the repository root README
