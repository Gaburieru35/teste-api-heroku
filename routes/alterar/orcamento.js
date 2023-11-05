const express = require("express");
const router = express.Router();
const mysql = require('../../mysql').pool

router.put("/:id", (req, res, next)=>{
    const id = req.params.id
    const { descricao } = req.body;
    mysql.getConnection((error, conn) => {
        if(error){return res.status(500).send({error: error.message, status: 500})}
        conn.query(
            `update orcamento set descricaoOrcamento = '${descricao}' WHERE idOrcamento = ${id}`,
            (error, result, fields) => {
                conn.release()
                if (error) {
                    return res.status(500).send({ error: error });
                }

                if (result.affectedRows > 0) {
                    return res.status(200).send({ message: "Ok" });
                } else {
                    return res.status(404).send({ error: { statusCode: 404, description: "Not Found" } });
                }
            }
        )
    })
})

module.exports = router