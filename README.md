# Spyglass

A Valtech and Contentstack project.

[**spyglass.valtech.engineering**](https://spyglass.valtech.engineering)

This readme is in progress! 🚧  
Please pardon the dust. 

## Background

Project Spyglass is a web-based augmented reality demo using [Contentstack](https://www.contentstack.com) as a headless content management system. Our current demo is focused on retail skincare products.

[![A video explaining Spyglass.](https://spyglass.valtech.engineering/images/demo_poster.jpg)](https://spyglass.valtech.engineering/images/demo.mp4)

##### High-level Dev Tasks
* Pull data from Contentstack
* Populate imagery and text assets
* Display and animate content based on marker and/or image tracking
* Explore different ways that markers can be used for UI control


## Libraries
We are using [AR.js](https://ar-js-org.github.io/AR.js-Docs/) and [A-Frame](https://aframe.io/) for image / marker-based tracking and displaying graphics. A-Frame uses Three.js under the hood, but provides some convenient features like an entity-component system and a handy way to inspect a scene in the browser. It's based on HTML tags, but can be manipulated programatically as well.

AR.js has separate builds for both Three.js and A-Frame compatibliity. In addition, there are separate builds for accessing the marker tracking and image tracking (NFT) features. Additional versions of AR.js are included in script tags in our inital `index.html` file (but some are commented out).

##### Notes
* [Three.js has an NPM module](https://www.npmjs.com/package/three)
* [A-Frame has an NPM module](https://www.npmjs.com/package/aframe)
* AR.js's NPM module is currently non-functional...and including some things as modules and some things as scripts is not playing nicely at the moment *(to be examined)*

## Setup

##### Before starting, run:

```npm install``` 
to install dependencies. (We currently only have development dependencies, as the libraries that we are using are hosted on CDNs.)

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

The `samples` folder contains the code sketches we created as we were building this project. We plan to clean these up a bit, but they exist here as a reference. You can launch them individually with the `dev:` scripts in the `package.json`.

## Adding images / markers to track
Originally we were going to keep the marker files in this repo (and you can still find them in the `src/markers` folder), but we are now hosting them on Contentstack as assets. They are served as `.patt.txt` to ensure they have a `text/?` content type, rather than `application/octet-stream`. *To be added here: notes on how to generate your own custom markers.*

## Creating your own stack
*To be added here: notes on how to import our content types into your own Contentstack account to create a new stack to use with a fork of this code.*

## Live Site and Deployment

All files in the `docs` directory on the `main` branch will be served at [https://spyglass.valtech.engineering](https://spyglass.valtech.engineering).

### Building the latest for the site

Running ```npm run build``` should put the latest into `docs/skincare/`. 

Unfortunately, as of right now, `parcel build`'s output does not reference the paths correctly for CSS `link`s, `script` tags, and `img` elements in the root directory. We've modified the `--public-url` from `./` to `../` and this fixes the HTML inside each of the scenario folders, but you will still need to manually change `docs/skincare/index.html` to remove the `../` in front of each filename. (We aim to fix that in the future, but for now, it's an extra step you must do every time after `npm run build`.)

### Contributing

This project is hosted on Github Pages and is using Jekyll to build the site. It is recommended that you use rbenv for your Ruby and GEM environment. Here is a decent [guide](https://jekyllrb.com/docs/installation/) if you need help setting up Ruby.

Install the bundler by running:

`$ gem install bundler:2.1.4`

To set up your development environment first run the following from the `docs` directory:

`$ bundle install`

To build the site and make it available on a local server:

`$ bundle exec jekyll serve`

>NOTE: There is NO external CI for this project. Code with build steps must be built manually locally before pushing to this `docs` folder.