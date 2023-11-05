const express = require("express");
const router = express.Router();
const mysql = require('../mysql').pool

//route that gets all the equipments in the database
router.get("/", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({error: error.message, status: 500}) }
        conn.query(
            "SELECT * FROM oficinas",
            (error, result, fields) => {
                conn.release()
                if(error){ return res.status(500).send({error: error}) }
                else{ return res.status(200).send(result) }
            }
        )
    })
})

//route that gets an equipment by it`s ID
router.get("/:id", (req, res, next) => {
    const id = req.params.id
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error.message, status: 500})}
        conn.query(
            `SELECT * FROM oficinas WHERE idOficina = ${id}`,
            (error, result, fields) => {
                if(error){ return res.status(500).send({error: error}) }
                if(result.length > 0){ return res.status(200).send(result) }
                else{ return res.status(404).send({error: {stausCode: 404, description: "Not Found"}}) }
            }
        )
    })
})

router.get("pesquisar/:textoPesquisa", (req, res, next) => {
    const text = req.params.textoPesquisa
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error.message, status: 500})}
        conn.query(
            `SELECT * FROM oficinas WHERE nome like '${text}'`,
            (error, result, fields) => {
                if(error){ return res.status(500).send({error: error}) }
                if(result.length > 0){ return res.status(200).send(result) }
                else{ return res.status(404).send({error: {stausCode: 404, description: "Not Found"}}) }
            }
        )
    })
})

module.exports = router