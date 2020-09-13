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
        upc
        form
        amount {
          quantity
          measurement
        }
        packaging {
          type
        }
        rating
        additional_contraindications
        usage_frequencyConnection(limit:7) {
          edges {
            node {
              ... on UsageTimeTags {
                title
              }
            }
          }
        }
        marker_fileConnection(limit: 3) {
          edges {
            node {
              title
              url
            }
          }
        }
        product_imagesConnection(limit: 1) {
          edges {
            node {
              title
              url
            }
          }
        }
        instructions {
          step_instruction_text
        }
        ingredient_list {
          concentration
          ingredientsConnection {
            edges {
              node {
                ... on Ingredient {
                  title
                  name
                  also_known_as
                  imageConnection {
                    edges {
                      node {
                        title
                        url
                      }
                    }
                  }
                  contraindications
                }
              }
            }
          }
        }
      }
    }
  }`;
  function rearrangeAPIResponse(response) {
    let newData = [];
    if (response?.data?.all_product) {
      newData = {'serums': [...response.data.all_product.items]};
      for (let i = 0; i < newData.serums.length; i++) {
        console.log(newData.serums[i]);
        const entry = {
          // Add an id (What serum no. is it?)
          '_id': parseInt(newData.serums[i].product_name.split(' ')[2]),
          ...newData.serums[i]
        }
        console.log()
        // Remove nesting of references
        // ✔️ contraindications (see ingredients below)
        entry.contraindications = []; 
        if (entry.additional_contraindications?.length) {
          entry.contraindications.push(entry.additional_contraindications);
        }
        delete(entry.additional_contraindications);
        // ✔️ usage frequency
        entry.usage_frequency = entry.usage_frequencyConnection.edges.map((item) => item.node.title);
        delete(entry.usage_frequencyConnection);
        // ✔️ marker pattern
        entry.marker_patt_urls = entry.marker_fileConnection.edges.map((item) => item.node.url);
        delete(entry.marker_fileConnection);
        // ✔️ product image
        entry.product_image_urls = entry.product_imagesConnection.edges.map((item) => item.node.url);
        delete(entry.product_imagesConnection);
        // ✔️ ingredients
        entry.ingredients = entry.ingredient_list.map((item) => {
          const ingredient_edges = item.ingredientsConnection.edges;
          if (ingredient_edges.length) {
            // There will only be one ingredient in the ingredientsConnection
            const n = {};
            n.name = ingredient_edges[0].node.name;
            n.also_known_as = ingredient_edges[0].node.also_known_as;
            if ('edges' in ingredient_edges[0].node.imageConnection && 
                ingredient_edges[0].node.imageConnection.edges.length) {
              n.image_url = ingredient_edges[0].node.imageConnection.edges[0].node.url;
            }
            if (item.concentration) n.concentration = item.concentration;
            // Add the contraindications 
            if (ingredient_edges[0].node.contraindications) {
              entry.contraindications.push(ingredient_edges[0].node.contraindications);
            }
            return n;
          } 
        });
        delete(entry.ingredient_list);
        // simplify usage instructions
        entry.directions = entry.instructions.map((item) => {return {text: item.step_instruction_text}});
        delete(entry.instructions);
        newData.serums[i] = entry;
        console.log(newData.serums[i], entry)
      }
    }
    
    return newData;
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
  .then(data => rearrangeAPIResponse(data));

  $export.innerHTML = JSON.stringify(productsByGraphQL, null, 2);
}

getStackData();