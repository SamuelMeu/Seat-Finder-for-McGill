import { App, staticFiles } from "fresh"

export const app = new App()

app.use(staticFiles())

// Middleware
app.use(async (ctx) => {
  const start = performance.now()

  const resp = await ctx.next()

  const end = performance.now()
  const duration = (end - start).toFixed(2)

  resp.headers.set("X-Response-Time", `${duration}ms`)

  return resp
})

// Include file-system based routes here
app.fsRoutes()


