const express = require("express");
const router = express.Router();
const mysql = require('../mysql').pool

router.get("/", (req, res, next)=>{
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error.message, status: 500})}
        conn.query(
            "SELECT * FROM veiculo",
            (error, result, fields) => {
                conn.release()
                if(error){return res.status(500).send({error: error}) }
                else{ return res.status(200).send({veiculo: result}) }
            }
        )
    })
})

router.get("/pesquisar", (req, res, next) => {
    const idCliente = req.query.idCliente;
    const idReparo = req.query.idReparo;
    if(idReparo == null){
        mysql.getConnection((error, conn) => {
            if(error){return res.status(500).send({error: error.message, status: 500})}
            conn.query(
                `SELECT * FROM veiculo WHERE cliente_usuario_idUsuario = ${idCliente}`,
                (error, result, fields) => {
                    if(error){ return res.status(500).send({error: error}) }
                    if(result.length > 0){ return res.status(200).send(result) }
                    else{ return res.status(404).send({error: {stausCode: 404, description: "Not Found"}}) }
                }
            )
        })
    }else{
        mysql.getConnection((error, conn) => {
            if(error){return res.status(500).send({error: error.message, status: 500})}
            conn.query(
                `select * from veiculo v left join orcamento o on o.veiculo_idVeiculo = v.idVeiculo
                join orcamento_reparo orr on orr.orcamento_idOrcamento = o.idOrcamento
                join reparo r on r.idReparo = orr.reparo_idReparo
                where r.idReparo = ${idReparo}`,
                (error, result, fields) => {
                    if(error){ return res.status(500).send({error: error}) }
                    if(result.length > 0){ return res.status(200).send(result) }
                    else{ return res.status(404).send({error: {stausCode: 404, description: "Not Found"}}) }
                }
            )
        })
    }
    
})


router.get("/:id", (req, res, next)=>{
    const id = req.params.id
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error.message, status: 500})}
        conn.query(
            `SELECT * FROM veiculo WHERE idVeiculo = ${id}`,
            (error, result, fields) => {
                conn.release()
                if(error){return res.status(500).send({error: error}) }
                if(result.length > 0){ return res.status(200).send({veiculo: result}) }
                else{ return res.status(404).send({error: {statusCode: 404, description: "Not Found"}})}
            }
        )
    })
})

module.exports = router