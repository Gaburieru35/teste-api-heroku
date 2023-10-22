const express = require('express');
const app = express();
const bodyParser = require('body-parser')

//import das rotas
const clienteRoute = require("./routes/cliente")
const oficinasRoute = require("./routes/oficinas")

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

//headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Header", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method == "OPTIONS"){
        res.header("Access-Control-Allow-Methods","GET");
        return res.status(200).send({})
    }
    next();
})

app.use("/cliente", clienteRoute)
app.use("/oficinas", oficinasRoute)

//creates a new error if none of the routes are used
app.use((req, res, next) => {
    const erro = new Error("Not Found");
    erro.status = 404;
    next(erro)
})

app.use((error, req, res, next) => {
    res.status = error.status || 500
    return res.send({
        mensagem: error.message + ": Available resources: [tdolls, equipments, users]" 
    })
})

module.exports = app;