const express = require("express");
const router = express.Router();
const mysql = require('../mysql').pool

//route that gets an equipment by it`s ID
router.get("/:id", (req, res, next) => {
    const id = req.params.id
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error.message, status: 500})}
        conn.query(
            `select o.nome, e.nomeEspecialidade from oficinas o
            join oficinas_especialidades oe on oe.oficinas_idoficinas = o.idoficinas
            join especialidades e on e.idEspecialidades = oe.especialidades_idEspecialidades
            where o.idoficinas = ${id}`,
            (error, result, fields) => {
                if(error){ return res.status(500).send({error: error}) }
                if(result.length > 0){ return res.status(200).send(result) }
                else{ return res.status(404).send({error: {stausCode: 404, description: "Not Found"}}) }
            }
        )
    })
})

module.exports = router