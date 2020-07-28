require('dotenv').config()

module.exports = { cors, asyncJsonHandler}

function cors (fn) {
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
        res.status(200).json({ status, data })
      }
    }
  }