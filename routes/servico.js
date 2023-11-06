const express = require("express");
const router = express.Router();
const mysql = require('../mysql').pool

router.get("/", (req, res, next)=>{
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error.message, status: 500})}
        conn.query(
            "SELECT * FROM servico",
            (error, result, fields) => {
                conn.release()
                if(error){return res.status(500).send({error: error}) }
                else{ return res.status(200).send({servico: result}) }
            }
        )
    })
})

router.get("/:id", (req, res, next)=>{
    const id = req.params.id
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error.message, status: 500})}
        conn.query(
            `SELECT * FROM servico WHERE idServico = ${id}`,
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