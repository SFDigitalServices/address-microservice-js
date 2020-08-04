require('dotenv').config()
const { EAS_API_URL, EAS_APP_TOKEN, EAS_REFRESH_TIME } = process.env

const { cors, asyncJsonHandler } = require('../../../lib/handlers')
const axios = require('axios')
const moment = require('moment-timezone')
moment.tz.setDefault('America/Los_Angeles')

module.exports = cache(cors(asyncJsonHandler((req, res) => {
  return doLookup(req.query)
})))

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

function cache (fn) {
  return (req, res) => {
    // calculate next EAS refresh time to set `max-age`
    const now = moment()
    const refreshTime = moment(now.clone().format('YYYY-MM-DD') + ' ' + EAS_REFRESH_TIME)
    if (refreshTime.diff(now) < 0) {
      refreshTime.add(1, 'days')
    }

    const maxAge = refreshTime.diff(now, 'seconds')

    // set Cache-Control
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate, max-age=' + maxAge)
    return fn(req, res)
  }
}
