import secrets from './secrets';

async function getStackData() {
  const $export = document.querySelector('#cleaned_output');

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
        additional_contraindications
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
  function cleanUpResponse(data) {
    const items = [...data.all_product.items];
    
    console.log(data);
    // for each item returned
    // newData = [...data];
    
    // remove nesting of references
    // simplify usage instructions
    // simplify display of active ingredients
    // get urls of assets
    // aggregate contraindications
    return data;
  }

  // Guidance here: https://graphql.org/learn/serving-over-http/#http-methods-headers-and-body
  const productsByGraphQL = await window.fetch(
    GQL_URL,
    {
      method: 'POST', 
      headers: GQL_HEADERS,
      body: JSON.stringify({query: gqlQuery})
    }
    )
  .then(response => response.json())
  .then(data => cleanUpResponse(data));

  $export.innerHTML = JSON.stringify(productsByGraphQL, null, 2);
}

getStackData();