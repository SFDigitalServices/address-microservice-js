const { apiHandler } = require('../../../lib/handlers')
const axios = require('axios');

module.exports = apiHandler((req, res) => {
  return doLookup(req.query)
})

async function doLookup(params) {
  EAS_API_URL = process.env.EAS_API_URL
  params.$where = `address like upper('${params.search}%') and parcel_number IS NOT NULL`
  delete params.search
  
  let data = await axios.get(EAS_API_URL, {params: params})
    .then(response => {
      return response.data; 
    })
    .catch(error => console.log('Error', error));
  
  return {items: data}
}