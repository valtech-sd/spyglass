# Contentstack integration

This sample shows how to retrieve data from the Contentstack API. 

GET requests to the cdn are not rate-limited.

## Setup

Run the server using 
```
npm run dev:contentstack
```
from the repository root. It will retrieve all of the records as a JSON file and put it on the screen.

## Using API Key and Delivery Token

We're keeping the API Key and Delivery token for this stack in a separate `secrets.js` file for now. It looks like the following: 

```js
const secrets = {
  apiKey: 'API_KEY_GOES_HERE',
  environment: 'localhost-dev',
  deliveryToken: 'DELIVERY_TOKEN_GOES_HERE',
}
export default secrets;
```

`apiKey` and `deliveryToken` are stored in the shared 1Password (or accessed within Contentstack from the Spyglass ⚙️ menu > Tokens).