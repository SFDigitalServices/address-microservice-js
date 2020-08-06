const moment = require('moment-timezone')
moment.tz.setDefault('America/Los_Angeles')

module.exports = { corsHandler, asyncJsonHandler, cacheHandler, getCacheMaxAge }

function corsHandler (fn) {
  return (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    return fn(req, res)
  }
}

function asyncJsonHandler (fn) {
  return async (req, res) => {
    try {
      const { status = 'success', ...data } = await fn(req, res)
      res.status(200).json({ status, data })
    } catch (error) {
      console.log('Error', error)
      const { status = 'error', data = {} } = error
      res.status(500).json({ status, data })
    }
  }
}

function cacheHandler (fn, serverRefreshTime) {
  return (req, res) => {
    // set Cache-Control
    const maxAge = serverRefreshTime ? getCacheMaxAge(serverRefreshTime) : 0
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate, max-age=' + maxAge)
    return fn(req, res)
  }
}

function getCacheMaxAge (serverRefreshTime) {
  // calculate next server refresh time to set `max-age`
  const now = moment()
  const refreshTime = moment(now.clone().format('YYYY-MM-DD') + ' ' + serverRefreshTime)
  if (refreshTime.diff(now) < 0) {
    refreshTime.add(1, 'days')
  }

  const maxAge = refreshTime.diff(now, 'seconds')
  return maxAge
}
