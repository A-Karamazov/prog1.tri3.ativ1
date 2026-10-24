import login from "./index.html"
import home from "./home.html"
import db from "./db.ts"

const loggedUsers: any = {} //Objeto para armazenar os usuários logados

const srv = Bun.serve({
    port: 3000,
    routes: {
        "/": login,

        "/home": home,

        "/user": {
            POST: async (req) => {
                const body = await req.body?.json() //Recebe os dados do formulário de cadastro
                const query = db.query(`INSERT INTO user_secure(username, password_hash) VALUES(:username, :password_hash)`) 
                const hash = await Bun.password.hash(body.password) //Gera o hash da senha
                const data = query.run({ ":username": body.username, ":password_hash": hash })
                return Response.json(data)
            },
        },

        "/login": {
            POST: async (req) => {
                const body = await req.body?.json()
                const query = db.query(`SELECT * FROM user_secure WHERE username=:username LIMIT 1`) //Busca o usuário no db
                const data: any = query.get({ ":username": body.username })
                if (!data)
                    return Response.json({ msg: "Usuário não encontrado" }, { status: 404 })
                const isMatch = await Bun.password.verify(body.password, data.password_hash) 
                if (!isMatch) 
                    return Response.json({ msg: "Senha não confere" }, { status: 401 })
                const uuid = crypto.randomUUID(); //Gera um UUID para o usuário logado
                delete data.password_hash 
                loggedUsers[uuid] = data //Armazena o usuário logado no objeto loggedUsers com o UUID como chave
                req.cookies.set("ses", uuid) //Seta o cookie com o UUID do usuário logado
                return Response.json(isMatch)
            }
        },

        "/login/user": (req) => {
            const ses = req.cookies.get("ses")
            if (!ses || !loggedUsers[ses])
                return Response.json({ msg: "Não permitido" }, { status: 401 })
            return Response.json(loggedUsers[ses])
        }
    },
})

console.log(`Server running on ${srv.url}`)
