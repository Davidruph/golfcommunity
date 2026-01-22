import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'

const dev = false
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({
  dev,
  hostname,
  port,
  conf: {
    compress: true,
    poweredByHeader: false,
    generateEtags: false,
  },
})

const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error handling request:', err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  }).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
