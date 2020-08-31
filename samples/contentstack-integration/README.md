# Contentstack integration

This sample shows how to retrieve data from the Contentstack API. 

GET requests to the cdn are not rate-limited.

## Add the missing secrets file

We're keeping the API Key and Delivery token for this stack in a separate `./secrets.js` file for now. It's not tracked in git so that we avoid sharing the delivery token in GitHub. It looks like the following: 

```js
const secrets = {
  apiKey: 'API_KEY_GOES_HERE',
  environment: 'localhost-dev',
  deliveryToken: 'DELIVERY_TOKEN_GOES_HERE',
}
export default secrets;
```

`apiKey` and `deliveryToken` are stored in the shared 1Password (or accessed within Contentstack from the Spyglass ⚙️ menu > Tokens).

## Setup

Run the server using 
```
npm run dev:contentstack
```
from the repository root. It runs `./index.html`, which has demonstrates retrieving all of the serum products as JSON via the REST API (the Contentstack CDN) and via GraphQL (which also uses the CDN under the hood).