import path from 'path'
import express from 'express'
import { handleEvent, getEventType } from 'vitedge/node/index.js'

const example = process.argv[2]

if (!example) {
    throw new Error('Specify example name in the first argument')
}

const { default: functions } = await import(`../${example}/dist/functions.js`)
const { default: packageJson } = await import(
    `../${example}/dist/ssr/package.json`
    )
const { default: router } = await import(
    `../${example}/dist/ssr/${packageJson.main}`
    )
const { default: manifest } = await import(
    `../${example}/dist/client/ssr-manifest.json`
    )

// This could be Polka, Fastify or any other server
const server = express()

// Serve static files. Providers like Vercel or Netlify have specific ways to do this.
server.use(
    express.static(path.join(process.cwd(), `../${example}/dist/client`))
)

server.use(async (request, response) => {
    // Generate a full URL
    const url = new URL(
        request.protocol + '://' + request.get('host') + request.originalUrl
    )

    try {
        const type = getEventType({ url, functions }) // api | props | render
        console.info('-', type, url.pathname)

        const { statusCode, body, headers } = await handleEvent(
            { url, functions, router, manifest, preload: true },
            // This will be directly passed to api/props handlers
            { request, method: request.method, headers: request.headers }
        )

        response
            .set(headers || {})
            .status(statusCode || 200)
            .end(body)
    } catch (error) {
        console.error(error)
        response.status(500).end(error.message)
    }
})

const port = 8080
console.log(`Server started: http://localhost:${port}`)
server.listen(port)

// // @ts-check
// const fs = require('fs')
// const path = require('path')
// const express = require('express')
//
// const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD
//
// async function createServer(
//     root = process.cwd(),
//     isProd = process.env.NODE_ENV === 'production'
// ) {
//     const resolve = (p) => path.resolve(__dirname, p)
//
//     const indexProd = isProd
//         ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
//         : ''
//
//     const manifest = isProd
//         ? // @ts-ignore
//         require('./dist/client/ssr-manifest.json')
//         : {}
//
//     const app = express()
//
//     /**
//      * @type {import('vite').ViteDevServer}
//      */
//     let vite
//     if (!isProd) {
//         vite = await require('vite').createServer({
//             root,
//             logLevel: isTest ? 'error' : 'info',
//             server: {
//                 middlewareMode: 'ssr',
//                 watch: {
//                     // During tests we edit the files too fast and sometimes chokidar
//                     // misses change events, so enforce polling for consistency
//                     usePolling: true,
//                     interval: 100
//                 }
//             }
//         })
//         // use vite's connect instance as middleware
//         app.use(vite.middlewares)
//     } else {
//         app.use(require('compression')())
//         app.use(
//             require('serve-static')(resolve('dist/client'), {
//                 index: false
//             })
//         )
//     }
//
//     app.use('*', async (req, res) => {
//         try {
//             const url = req.originalUrl
//
//             let template, render
//             if (!isProd) {
//                 // always read fresh template in dev
//                 template = fs.readFileSync(resolve('index.html'), 'utf-8')
//                 template = await vite.transformIndexHtml(url, template)
//                 render = (await vite.ssrLoadModule('/src/entry-server.js')).render
//             } else {
//                 template = indexProd
//                 render = require('./dist/server/entry-server.js').render
//             }
//
//             const [appHtml, preloadLinks] = await render(url, manifest)
//
//             const html = template
//                 .replace(`<!--preload-links-->`, preloadLinks)
//                 .replace(`<!--app-html-->`, appHtml)
//
//             res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
//         } catch (e) {
//             vite && vite.ssrFixStacktrace(e)
//             console.log(e.stack)
//             res.status(500).end(e.stack)
//         }
//     })
//
//     return { app, vite }
// }
//
// if (!isTest) {
//     createServer().then(({ app }) =>
//         app.listen(3000, () => {
//             console.log('http://localhost:3000')
//         })
//     )
// }
//
// // for test use
// exports.createServer = createServer


// import express from 'express'
// import { createSsrServer } from 'vitedge/dev'
//
// async function createServer() {
//     const app = express()
//
//     // Create Vitedge server in middleware mode
//     const viteServer = await createSsrServer({
//         server: { middlewareMode: 'ssr' },
//     })
//
//     // Use Vite's connect instance as middleware
//     app.use(viteServer.middlewares)
//
//     app.listen(3000)
// }
//
// createServer()
