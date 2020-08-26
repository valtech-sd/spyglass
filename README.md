# Spyglass

A Valtech and Contentstack project.
This readme is in progress :)

## Background

Spyglass is an AR-enabled demo that will use AR-tracking to display and control different types of content pulled from Contentstack (hand waving).

##### High-level Dev Tasks
* Pull data from Contentstack
* Populate imagery and text assets
* Display and animate content based on marker and/or image tracking
* Explore different ways that markers can be used for UI control


## Libraries
We are currently using [AR.js](https://ar-js-org.github.io/AR.js-Docs/) and [A-Frame](https://aframe.io/) for image / marker-based tracking and displaying graphics. A-Frame uses Three.js under the hood, but provides some convenient features like an entity-component system and a handy way to inspect a scene in the browser. It's based on HTML tags, but can be manipulated programatically as well.

AR.js has separate builds for both Three.js and A-Frame compatibliity. In addition, there are separate builds for accessing the marker tracking and image tracking (NFT) features. Add versions of AR.js are included in script tags in our inital `index.html` file (but some are commented out).

##### Notes
* [Three.js has an NPM module](https://www.npmjs.com/package/three)
* [A-Frame has an NPM module](https://www.npmjs.com/package/aframe)
* AR.js's NPM module is currently non-functional...and including some things as modules and some things as scripts is not playing nicely at the moment (to be examined)

## Setup

##### Our first example
We have a basic app running in `index.html` and `index.js`. All we're doing at the moment is showing a sample A-Frame scene with some cool shapes.

##### Getting Ready
As of now, this library has an npm package file, but no NPM packages! Blame this on AR.js not having a working module at the moment. Everything is included in script tags in our `index.html` file.

##### Before starting, run:

```npm install``` 
to install currently non-existent dependencies

##### To run our initial dev app:
```npm run dev``` to run a script that will serve the app on `https://localhost:1234` with self-signed certificates. You may need to enable self-signed certificates in your browser's security settings. HTTPS is required because we are accessing the device's camera.

## Adding Samples

We plan to add sample projects to a separate directory, so that they can exist as a reference. We may also add additional script commands for running different samples. More on this later, when we actually create our first sample.

## Adding images / markers to track
TBD