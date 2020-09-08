# Camera Blur Overlay Example

This example shows how to create a blurred webcam overlay with an unblurred cutout.

To achieve a blurred overlay effect, we pass the webcam texture through a shader (by setting the selected div as a material of a plane).

* **Vertex shader pass** --> We reposition the 4 vertices in our plane so that the plane occupies the entire rendering window
* **Fragment shader pass** --> We sample our source pixels (the video texture) and apply a single-pass Gaussian blur to get our blurry effect

## Pending Dev Work
* We need to consider the margins of the webcam stream when sampling our pixels in the shader, so we're not changing the aspect ratio in our blurred result and so the filtered video perfect aligns with the non-filtered video
* Alex is going to ask Jason about this from the CSS side of thing
* Should be a quick update

## Files
* `camera-overlay.html`
     -  Our basic HTML page setup. We add a basic `a-plane` element with the material set to our custom `gaussian-blur` shader and a `webcam-overlay-helper` component. The plane's width and height should be set to 1.0, with a z as close to 0 as possible. 
     -  We also add a child plane which will serve as our "window". We add a `mask` component to this child.
* `webcam-overlay.js`
     -  Here we define our custom shaders and components
     -  The `gaussian-blur` shader and the `webcam-overlay-helper` must be used together. The `webcam-overlay-helper` handles resolution updates, updating shader variables, as well as passing throught the video texture once the video div has loaded.

As always, more documentation will / should be added!