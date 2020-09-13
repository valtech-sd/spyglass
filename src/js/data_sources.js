import secrets from '../../samples/contentstack-integration/secrets';

const data_sources = {
  contentstack: {},
  personalized: {}
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

getStackData();

// This data would be stored in another database.
data_sources.personalized = {
  other_product_images: {
    cleanser: 'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blt2768458962874adb/5f5d73c7ace172423d8845be/01_Cleanser_3.png',
    toner: 'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blt3b2f9c68cda139c8/5f5d73b82917074cd81a2925/02_Toner_3.png',
    moisturizer_empty: 'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blt879660a27aedbfec/5f5d73a665c9c14aec2fb9f7/04_Moisturizer_0.png',
    moisturizers: [
      'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blta69fd32048fdecab/5f5d740674038f4956e098d8/04_Moisturizer_1.png',
      'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blta69fd32048fdecab/5f5d740674038f4956e098d8/04_Moisturizer_1.png'
    ],
    sunscreen: 'https://images.contentstack.io/v3/assets/blte63f7056be4da683/blt80ab90086435bebe/5f5d739883eade441b6a6ae8/05_Sunscreen_0.png'
  },
  serums: [
    {
      _id: 1,
      why: [
        'Your skincare goals are anti-aging.',
        'This serum hydrates and smooths the skin naturally to prevent wrinkles.',
        'Sweet floral oils help refresh you in the morning and evening!'
      ],
      for_you: [
        'Been using this product for 3 weeks with smoother skin? Consider dropping your concentration from 5% to 2% to get more value out of your purchase.',
        'The UV index is super high today in your area! Make sure you make time to apply sunscreen at multiple times during the day after using this serum.'
      ],
      ratings: {
        approval: 86,
        friends_who_like: 6,
        reviews: [
          {
            user: 'yourfriendjen',
            testimonial: ''
          }
        ]
      }
    },
    {
      _id: 2,
      why: [
        'Your skincare goals include treating acne or irritated skin.',
        'Borage Seed is a natural mellowing agent.',
        'You\'re stressed out, friend.'
      ],
      for_you: [
        'Humidity forecasts are down for your location, so your skin may feel drier than usual, use a water based solution to hydrate your skin, then apply drops as needed.',
        'If you’re feeling a bit stressed out, Borage Seed Oil also offers a calming effect in addition to helping maintain healthy skin.'
      ],
      ratings: {
        approval: 47,
        friends_who_like: 2,
        reviews: [
          {
            user: 'yourfriendjen',
            testimonial: ''
          }
        ]
      }
    },
    {
      _id: 3,
      why: [
        'Your skincare goals include smoother skin.',
        'Of our three serums, this serum exfoliates and brightens, while also moisturizing, all of which dry skin needs.',
        'Get more value with greater quantity at lower price than our competing brands.'
      ],
      for_you: [
        'Need more moisturizer? Here\'s how to add our face oils into your routine to better hydrate your skin…',
        'The UV index is super high today in your area! Make sure you make time to apply sunscreen at multiple times during the day after using this serum.'
      ],
      ratings: {
        approval: 86,
        friends_who_like: 6,
        reviews: [
          {
            user: 'yourfriendjen',
            testimonial: ''
          }
        ]
      }
    }
  ],

}

export default data_sources;