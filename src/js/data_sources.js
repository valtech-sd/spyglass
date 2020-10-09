import secrets from '../../samples/contentstack-integration/secrets';

const data_sources = {
  contentstack: {},
  personalized: {},
  getData: () => 0
}

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
                  description
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
    let newData = {};
    if (response?.data?.all_product) {
      newData = {'serums': [...response.data.all_product.items]};
      for (let i = 0; i < newData.serums.length; i++) {
          const entry = {
          // Add an id (What serum no. is it?)
          '_id': parseInt(newData.serums[i].product_name.split(' ')[2]),
          ...newData.serums[i]
        }
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
            n.description = ingredient_edges[0].node.description;
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
      }
    }
    // console.log(newData);
    // Sort the serums
    newData.serums.sort((a,b) => a._id - b._id);
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

  data_sources.contentstack = productsByGraphQL;
}

// This data would be stored in another database.
data_sources.personalized = {
  other_product_images: {
    cleanser: 'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blt2768458962874adb/5f5d73c7ace172423d8845be/01_Cleanser_3.png',
    toner: 'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blt3b2f9c68cda139c8/5f5d73b82917074cd81a2925/02_Toner_3.png',
    moisturizer_empty: 'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blt879660a27aedbfec/5f5d73a665c9c14aec2fb9f7/04_Moisturizer_0.png',
    moisturizers: [
      'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blta69fd32048fdecab/5f5d740674038f4956e098d8/04_Moisturizer_1.png',
      'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blt7e0ba1616f10fbd1/5f5d85e42917074cd81a2929/04_Moisturizer_7.png'
    ],
    sunscreen: 'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blt80ab90086435bebe/5f5d739883eade441b6a6ae8/05_Sunscreen_0.png'
  },
  serums: [
    {
      _id: 1,
      why: [
        'Your goal is anti-aging.',
        'Better than leading competitors\' products.',
        'Cheaper than leading competitors\' products.',
        'Sweet floral fragrance!'
      ],
      for_you: [
        {
          title: 'Conserve and save',
          text: 'You\'ve used Serum for 3 weeks with smoother skin? Consider increasing your concentration from 2% to 5% to increase cell turnover at an even faster rate.'
        },
        {
          title: 'Shields up',
          text: 'The UV index is super high today in your area! Make sure to apply sunscreen throughout the day after using this serum.'
        }  
      ],
      
      ratings: {
        approval: 86,
        friends_who_like: 6,
        personal: {
          //personal review field - positive or negative (potential for text feedback in future)
          positive: null,
        },
        reviews: [
          {
            user: 'yourfriendjen',
            title: 'THE BEST SERUM OUT THERE',
            testimonial: '"This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even. This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even."'
          }
        ]
      }
    },
    {
      _id: 2,
      why: [
        'Your goal is moisturizing.',
        'Better than leading competitors\' products.',
        'Borage seed is a natural mellowing agent.',
        'No allergens for you!'
      ],
      for_you: [
        {
          title: 'Feeling drier?',
          text: 'Humidity forecasts are down for your location. Use a water-based solution to hydrate skin, then apply drops as needed.'
        },
        {
          title: 'Relax naturally',
          text: 'If you’re feeling a bit stressed out, know that Borage Seed Oil also creates a natural calming effect.'
        }  
      ],
      ratings: {
        approval: 47,
        friends_who_like: 2,
        personal: {
          positive: null,
        },
        reviews: [
          {
            user: 'yourfriendjen',
            title: 'THE BEST SERUM OUT THERE',
            testimonial: '"This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even."'
          }
        ]
      }
    },
    {
      _id: 3,
      why: [
        'Your goal is smoother skin.',
        'Better than leading competitors\' products.',
        'Cheaper than leading competitors\' products.',
        'No allergens for you!'
      ],
      for_you: [
        {
          title: 'Next level',
          text: 'Need more moisturizer? See our site to learn how to add our face oils into your routine to better hydrate your skin…'
        },
        {
          title: 'Shields up',
          text: 'The UV index is super high today in your area! Make sure to apply sunscreen throughout the day after using this serum.'
        }  
      ],
      ratings: {
        approval: 86,
        friends_who_like: 6,
        personal: {
          positive: null,
        },
        reviews: [
          {
            user: 'yourfriendjen',
            title: 'THE BEST SERUM OUT THERE',
            testimonial: '"This made such a huge difference with my combination-dry skin. My pore seem smaller, my skin brighter, and my complexion more even."'
          }
        ]
      }
    }
  ],

}

data_sources.getData = getStackData;
// console.log('inside data_sources.js and ',data_sources);

export default data_sources;