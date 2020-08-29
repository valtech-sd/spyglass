import secrets from './secrets';

// Namespace everything in a function!
async function main() {
  // Keeping the ancient jQuery convention of $variable = DOM node
  const $restOutput = document.querySelector('#cdn_output');
  const $graphqlOutput = document.querySelector('#gql_output');
  
  // two ways to get data from Contentstack: 
  // *****************************
  // 1. REST API using the CDN endpoint
  const CDN_URL = 'https://cdn.contentstack.io/v3/content_types/product/entries?'
                + 'include[]=ingredient_list.ingredients&'
                + 'include[]=ingredient_list.ingredients.purpose&'
                + 'include[]=ingredient_list.ingredients.allergically_similar&'
                //+ 'include[]=&'
                + `environment=${secrets.environment}&locale=en-us`;
  const CDN_HEADERS = {
    'Content-Type': 'application/json',
    'api_key': secrets.apiKey,
    'access_token': secrets.deliveryToken,
  };

  const productsByCDN = await window.fetch(
    CDN_URL,
    {
      method: 'GET', 
      headers: CDN_HEADERS
    }
  )
  .then(response => response.json());

  $restOutput.innerHTML = JSON.stringify(productsByCDN, null, 2);
  
  // *****************************
  // 2. Using GraphQL (https://www.contentstack.com/docs/developers/apis/graphql-content-delivery-api/explorer/)
  const GQL_URL = `https://graphql.contentstack.com/stacks/${secrets.apiKey}?environment=${secrets.environment}`
  const GQL_HEADERS = {
    'Content-Type': 'application/json',
    'access_token': secrets.deliveryToken,
  };
 const gqlQuery = `{
    all_product(where: {product_line: "Serums"}) {
      items {
        title
        product_name
        brand
        product_line
        price
        sku
        upc
        form
        rating
        ingredient_list {
          concentration
          ingredientsConnection {
            edges {
              node {
                ... on Ingredient {
                  title
                  description
                  contraindications
                  purposeConnection {
                    edges {
                      node {
                        ... on Tags {
                          title
                          description
                        }
                      }
                    }
                  }
                  known_to_be_allergenic
                  allergically_similarConnection {
                    edges {
                      node {
                        ... on Ingredient {
                          title
                          description
                          contraindications
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;

  // Guidance here: https://graphql.org/learn/serving-over-http/#http-methods-headers-and-body
  const productsByGraphQL = await window.fetch(
    GQL_URL,
    {
      method: 'POST', 
      headers: GQL_HEADERS,
      body: JSON.stringify({query: gqlQuery})
    }
    )
  .then(response => response.json());

  $graphqlOutput.innerHTML = JSON.stringify(productsByGraphQL, null, 2);
}

main();