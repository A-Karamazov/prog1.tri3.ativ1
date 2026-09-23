//           Banco de Dados   HTTP
// [C]reate  insert           post
// [R]ead    select           get
// [U]pdate  update           put
// [U]pdate  update           patch
// [D]elete  delete           delete
// 

import { db } from "./db"

const srv = Bun.serve({
    port: 3000,
    routes: {
        "/user": {
            GET: (req) => {
                const query = db.query(`
                    SELECT * FROM users
                `)
                const deResp = query.all()
                return Response.json(deResp)
            },

            POST: async (req) => {
                let body
                try {
                    body = await req.body.json()
                } catch (error: any) {
                    return Response.json({
                        message: "JSON mal formado",
                        parseError: error
                    }, { status: 400 })
                }
                if (!body.username)
                    return Response.json({ message: "Falta da informação: username" }, { status: 400 })

                if (!body.email)
                    return Response.json({ message: "Falta da informação: email" }, { status: 400 })

                if (!body.password)
                    return Response.json({ message: "Falta da informação: password" }, { status: 400 })

                const query = db.query(`
                    INSERT INTO users(username, email, password_hash)
                    VALUES(:username, :email, :password_hash)
                `)
                try {
                    const dbResp = query.run({
                        ':username': body.username,
                        ':email': body.email,
                        ':password_hash': body.password
                    })
                    return Response.json({
                        "message": "deu boa garote!",
                        dbResp
                    })
                } catch (e: any) {
                    if (e.code == "SQLITE_CONSTRAINT_UNIQUE") {
                        return Response.json({
                            message: "Username e Email precisam ser únicos",
                            code: "UNIQUE:CONSTRAINT"
                        }, { status: 400 })
                    }
                    return Response.json({
                        message: "Erro ao inserir no banco de dados",
                        dbError: e
                    }, { status: 500 })
                }
            },

        },

        "/user/:id": {
            GET: (req) => {
                const query = db.query(`
                    SELECT * FROM users
                    WHERE id=:_id_
                `)
                const deResp = query.get({ ":_id_": req.params.id })
                return Response.json(deResp)
            },

            PUT: async (req) => {
                const body = await req.body.json();
                const query = db.query(`
                    UPDATE Customers
                    SET username=:username, email=:email, password_hash=:password_hash
                    WHERE id=:_id_;       
                `)
                const dbResp = query.run({
                    ':_id_': req.params.id,
                    ':username': body.username,
                    ':email': body.email,
                    ':password_hash': body.password
                })
                return Response.json({ "message": "deu bom", dbResp })
            },
            DELETE: (req) => {
                const query = db.query(`
            DELETE FROM lista_exercicios
            WHERE id=:_id_
            `)
                const dbResp = query.run({
                    ":_id_": req.params.id
                })

                return Response.json({
                    message: "Exercício deletado com sucesso",
                    dbResp
                })
            },
        },

        "/exercicios": {
            GET: (req) => {
                const query = db.query(`
                    SELECT * FROM lista_exercicios
                `)
                const deResp = query.all()
                return Response.json(deResp)
            },
            POST: async (req) => {
                const body = await req.body.json();
                const query = db.query(`
                    INSERT INTO lista_exercicios(nome, descricao, grupoMuscular, tipo)
                    VALUES(:nome, :descricao, :grupoMuscular, :tipo)    
                `)
                const dbResp = query.run({
                    ':nome': body.nome,
                    ':descricao': body.descricao,
                    ':grupoMuscular': body.grupoMuscular,
                    ':tipo': body.tipo
                })
                return Response.json({ "message": "Exercicio adicionado com sucesso", dbResp })
            },
        },

        "/exercicios/:id": {
            GET: (req) => {
                const query = db.query(`
                    SELECT * FROM lista_exercicios
                    WHERE id=:_id_
                `)
                const deResp = query.get({ ":_id_": req.params.id })
                return Response.json(deResp)
            },

            PUT: async (req) => {
                const body = await req.body.json();
                const query = db.query(`
                    UPDATE lista_exercicios
                    SET nome=:nome, descricao=:descricao, grupoMuscular=:grupoMuscular, tipo=:tipo
                    WHERE id=:_id_;     
                `)
                const dbResp = query.run({
                    ':nome': body.nome,
                    ':descricao': body.descricao,
                    ':grupoMuscular': body.grupoMuscular,
                    ':tipo': body.tipo,
                    ":_id_": req.params.id
                })
                return Response.json({ "message": "Exercicio modificado com sucesso", dbResp })
            },

            DELETE: (req) => {
                const query = db.query(`
                    DELETE FROM lista_exercicios
                    WHERE id=:_id_
                `)
                const dbResp = query.run({
                    ":_id_": req.params.id
                })

                return Response.json({
                    message: "Exercício deletado com sucesso",
                    dbResp
                })
            }
        }
    }
})

console.log(`Server running: ${srv.url}`)
