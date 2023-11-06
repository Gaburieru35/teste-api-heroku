const express = require("express");
const router = express.Router();
const mysql = require('../mysql').pool

router.get("/", (req, res, next)=>{
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error.message, status: 500})}
        conn.query(
            "SELECT * FROM cliente c join usuario u on u.idUsuario = c.usuario_idUsuario",
            (error, result, fields) => {
                conn.release()
                if(error){return res.status(500).send({error: error}) }
                else{ return res.status(200).send({cliente: result}) }
            }
        )
    })
})

router.post("/", (req, res, next)=>{
    mysql.getConnection((error, conn) => {
        const id = Date.now();
        const cliente = req.body 
        if(error){return res.status(500).send({error: error.message, status: 500})}
        const sql1 = "INSERT INTO usuario (`idUsuario`, `nomeUsuario`, `cpfUsuario`) VALUES ?"
        let values1 = [[id, cliente.nome, cliente.cpf]]
       
        conn.query(sql1, [values1],
            (error, result, fields) => {
                console.log(error)
                // if(error){return res.status(500).send({error: error}) }
                // else{ return res.status(200).send({cliente: result}) }
            }
        )

        const sql2 = "INSERT INTO cliente (`emailCliente`, `senhaCliente`, `endereçoCliente`, `telefoneCliente`, `usuario_idUsuario`) VALUES ?"
        let values2 = [[cliente.email, cliente.senha, cliente.endereco, cliente.telefone, id]]

        conn.query(sql2, [values2],
            (error, result, fields) => {
                conn.release()
                if(error){return res.status(500).send({error: error}) }
                else{ return res.status(200).send({cliente: result}) }
            }
        )
    })
})

router.get("/:id", (req, res, next)=>{
    const id = req.params.id
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error.message, status: 500})}
        conn.query(
            `SELECT * FROM cliente c join usuario u on u.idUsuario = c.usuario_idUsuario WHERE usuario_IdUsuario = ${id}`,
            (error, result, fields) => {
                conn.release()
                if(error){return res.status(500).send({error: error}) }
                if(result.length > 0){ return res.status(200).send({cliente: result}) }
                else{ return res.status(404).send({error: {statusCode: 404, description: "Not Found"}})}
            }
        )
    })
})

router.put("/alterar/:id", (req, res, next)=>{
    const id = req.params.id
    const cliente = req.body 

    const sql1 = `UPDATE usuario SET
            nomeUsuario = "${cliente.nome}",
            cpfUsuario = "${cliente.cpf}"
            where idUsuario = ${id}`

    const sql2 =  `UPDATE cliente SET
                 emailCliente = "${cliente.email}",
                 senhaCliente = "${cliente.senha}",
                 endereçoCliente = "${cliente.endereco}",
                 telefoneCliente = "${cliente.telefone}"
                 where usuario_idUsuario = ${id}`


    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error.message, status: 500})}
        conn.query(sql1,
            (error, result, fields) => {
                console.log(error)
            }
        )

        conn.query(sql2,
            (error, result, fields) => {
                if(error){return res.status(500).send({error: error}) }
                if(result.length > 0){ return res.status(200).send({cliente: result}) }
            }
        )
    })
})

module.exports = router
