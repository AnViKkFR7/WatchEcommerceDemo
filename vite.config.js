import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Dev-only middleware mirroring api/watches.js + api/company.js (Vercel
// serverless functions), so `npm run dev` behaves the same as production
// without needing `vercel dev`. See api/_lib/catalog.js for why this data
// is fetched server-side with the service role key instead of a client-side
// anon key.
function devApiPlugin(env) {
  return {
    name: 'timecraft-dev-api',
    configureServer(server) {
      for (const [key, value] of Object.entries(env)) {
        if (value !== undefined) process.env[key] = value
      }

      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/watches' && req.method === 'GET') {
          try {
            const { getWatches } = await import('./api/_lib/catalog.js')
            const watches = await getWatches()
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(watches))
          } catch (err) {
            console.error('[dev api/watches]', err)
            res.statusCode = 500
            res.end(JSON.stringify({ error: String(err.message || err) }))
          }
          return
        }
        if (req.url === '/api/company' && req.method === 'GET') {
          try {
            const { getCompanyPublicInfo } = await import('./api/_lib/catalog.js')
            const company = await getCompanyPublicInfo()
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(company))
          } catch (err) {
            console.error('[dev api/company]', err)
            res.statusCode = 500
            res.end(JSON.stringify({ error: String(err.message || err) }))
          }
          return
        }
        if (req.url === '/api/track' && req.method === 'POST') {
          // Analytics ingestion isn't needed for local UI dev — ack so
          // navigator.sendBeacon doesn't spam the console with 404s.
          res.statusCode = 204
          res.end()
          return
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), devApiPlugin(env)],
    server: {
      port: Number(process.env.PORT) || 5174,
    },
  }
})
