require('dotenv').config()
const { EAS_API_URL, EAS_APP_TOKEN, EAS_REFRESH_TIME } = process.env

const { corsHandler, asyncJsonHandler, cacheHandler } = require('../../../lib/handlers')
const axios = require('axios')

module.exports = cacheHandler(corsHandler(asyncJsonHandler((req, res) => {
  return jsonQuery(req.query)
})), EAS_REFRESH_TIME)

async function jsonQuery (params) {
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
