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

## Sharing your dev app with the team

##### ngrok
If you're sharing an in-progress branch, ngrok is broadcasts your localhost dev server with the team or with your phone (in a way that might not require moving self-signed certificates over to your phone).

1. Sign up for an account on [ngrok](https://dashboard.ngrok.com/signup)
2. Follow the instructions on the site to 
     - download the ngrok command line app 
     - unzip it per their instructions 
     - add the authtoken to tie it to your ngrok account
3. Run your dev server (e.g. `npm run dev`)
4. In a separate terminal window, run ngrok, like so: 

          ./ngrok http https://127.0.0.1:1234

     It will give you a URL to use (e.g. `https://c17b3dd34d21.ngrok.io`).

If you need to _actively develop_ while sharing, you may want to temporarily point the server to a different source so that you can switch branches or make changes without affecting the running build. One way could be to move the `--out-dir` of the `parcel` script in your package.json to point to a copy of the source folder, in a directory not being modified, so that you can leave the server running while you continue work. Another way might be to add an npm script that runs [`parcel build`](https://parceljs.org/production.html) to an external folder, and then serve it with something like [`https-server`](https://gist.github.com/jonsamp/587b78b7698be7c7fd570164a586e6b7).

## Adding Samples

We plan to add sample projects to a separate directory, so that they can exist as a reference. We may also add additional script commands for running different samples. More on this later, when we actually create our first sample.

## Adding images / markers to track
TBD