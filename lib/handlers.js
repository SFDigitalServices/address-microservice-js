require('dotenv').config()

module.exports = { apiHandler }

function apiHandler (handler) {
  return asyncJsonHandler(handler)
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