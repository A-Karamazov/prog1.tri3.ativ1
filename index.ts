const srv = Bun.serve({
    port: 3000,
    routes: {
        "/test": {
            GET: () => new Response("Andrei Bobão_GET"),

            POST: async (req) => {
                const body = await req.body.text()
                console.log(body)
                return new Response("Andrei Bobão_POST")
            },

            PUT: () => new Response("Andrei Bobão_PUT"),
            DELETE: () => new Response("Andrei Bobão_DELETE")
        }
    }
})

console.log(`Server running: ${srv.url}`)