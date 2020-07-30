require('dotenv').config()
const { EAS_API_URL } = process.env

const { cors, asyncJsonHandler } = require('../../../lib/handlers')
const axios = require('axios')

module.exports = cors(asyncJsonHandler((req, res) => {
  return doLookup(req.query)
}))

async function doLookup (params) {
  params.$where = `address like upper('${params.search}%') and parcel_number IS NOT NULL`
  delete params.search

  const data = await axios.get(EAS_API_URL, { params: params })
    .then(response => {
      return response.data
    })
    .catch(error => console.log('Error', error))

  return { items: data }
}
