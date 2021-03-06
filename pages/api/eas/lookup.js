require('dotenv').config()
const { EAS_API_URL, EAS_APP_TOKEN, EAS_REFRESH_TIME } = process.env

const { corsHandler, asyncJsonHandler, cacheHandler } = require('../../../lib/handlers')
const axios = require('axios')

module.exports = cacheHandler(corsHandler(asyncJsonHandler((req, res) => {
  return doLookup(req.query)
})), EAS_REFRESH_TIME)

async function doLookup (params) {
  params.$where = `address like upper('${params.search}%') and parcel_number IS NOT NULL`
  delete params.search

  const config = {
    params: params,
    headers: {
      'X-App-Token': EAS_APP_TOKEN
    }
  }

  const data = await axios.get(EAS_API_URL, config)
    .then(response => {
      return response.data
    })
    .catch(error => {
      console.log('Error', error)
      throw Error(error)
    })

  return { items: data }
}
