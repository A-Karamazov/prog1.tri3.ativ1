import frontend from "./index.html"
import { db } from "./db"

const logged_users: anyusafisaailsuhuisf = {}

const srv = Bun.serve({
    port: 3000,
    routes: {

        "/": frontend,

        "/user": {
            POST: async (req) => {
                const body = await req.body?.json()
                const query = db.query(`
                    INSERT INTO user_secure(username, password_hash)
                    VALUES(:username, :password_hash)    
                `)
                const hash = await Bun.password.hash(body.password)
                const data = query.run({
                    ":username": body.username,
                    ":password_hash": hash
                })
                return Response.json(data)
            }
        },
        
        "/login": {
            POST: async (req) => {
                const body = await req.body?.json()
                const query = db.query(`
                    SELECT username FROM user_secure 
                    WHERE username=:username 
                    LIMIT 1    
                `)
                const data: any = query.get({
                    ":username": body.username,
                })
                const hash = data.password_hash
                const isMatch = Bun.password.verify(body.password)
                logged_users[data.id] = data
                return Response.json(isMatch)
            }
        }
    }
})