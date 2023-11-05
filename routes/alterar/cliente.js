const express = require("express");
const router = express.Router();
const mysql = require('../../mysql').pool

router.put("/:id", (req, res, next)=>{
    const id = req.params.id
    const { nome } = req.body;
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error.message, status: 500})}
        conn.query(
            `update usuario set nomeUsuario = '${nome}' WHERE IdUsuario = ${id}`,
            (error, result, fields) => {
                conn.release()
                if (error) {
                    return res.status(500).send({ error: error });
                }

                if (result.affectedRows > 0) {
                    return res.status(200).send({ message: "Ok" });
                } else {
                    return res.status(404).send({ error: { statusCode: 500, description: "Error" } });
                }
            }
        )
    })
})

module.exports = router