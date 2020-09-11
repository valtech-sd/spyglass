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

## What data is needed where?

### Scenario 1

| data | from contentstack? | local ? |
|------|--------------------|---------|
| _which cleanser_ |   | x |
| cleanser: product name & image | x |   |
| _which toner_ |   | x |
| toner: product name & image | x |   |
| _which eligible serums_ |   | x |
| serum: product name & image | x |   |
| serum: why it is better for you |   | x |
| serum: percentage fit for your goals |   | x |
| serum: (fake) reviews |   | x |
| serum: ingredients & contraindications | x |   |
| user's allergies related to contraindications |   | x |
| serum: marker .patt | x |   |
| _which eligible moisturizers_ |   | x |
| moisturizer: product name & image | x |   |

### Scenario 2

| data | from contentstack? | local ? |
|------|--------------------|---------|
| serum: product name | x |   |
| serum: marker .patt | x |   |
| serum: usage instructions | x |   |
| serum: ingredients & benefits | x |   |

### Scenario 3

| data | from contentstack? | local ? |
|------|--------------------|---------|
| serum: product name | x |   |
| serum: marker .patt | x |   |
| serum: usage instructions | x |   |
| serum: ingredients & benefits | x |   |
| serum: capture your review |   | x |
| serum: new for you |   | x |

## Cleanup

_What does it do?_

## Injecting into A-Frame

_Instructions here?_