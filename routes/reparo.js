const express = require("express");
const router = express.Router();
const mysql = require('../mysql').pool

router.get("/", (req, res, next)=>{
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error.message, status: 500})}
        conn.query(
            "SELECT * FROM reparo",
            (error, result, fields) => {
                conn.release()
                if(error){return res.status(500).send({error: error}) }
                else{ return res.status(200).send({reparo: result}) }
            }
        )
    })
})

router.get("/pesquisar", (req, res, next) => {
    const idVeiculo = req.query.idVeiculo;

    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error.message, status: 500})}
        conn.query(
            `select * from reparo r join orcamento_reparo orr on r.idReparo = orr.reparo_idReparo
            join orcamento o on o.idOrcamento = orr.orcamento_idOrcamento
            join veiculo v on v.idVeiculo = o.veiculo_idVeiculo
            where v.idVeiculo = ${idVeiculo};`,
            (error, result, fields) => {
                if(error){ return res.status(500).send({error: error}) }
                if(result.length > 0){ return res.status(200).send(result) }
                else{ return res.status(404).send({error: {stausCode: 404, description: "Not Found"}}) }
            }
        )
    })    
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