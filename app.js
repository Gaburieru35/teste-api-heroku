const express = require('express');
const app = express();
const bodyParser = require('body-parser')

//import das rotas GET
const clienteRoute = require("./routes/cliente")
const oficinasRoute = require("./routes/oficinas")
const veiculoRoute = require("./routes/veiculo")
const funcionarioRoute = require("./routes/funcionario")
const oracamentoRoute = require("./routes/orcamento")
const reparoRoute = require("./routes/reparo")
const servicoRoute = require("./routes/servico")
const especialidadeRoute = require("./routes/especialidade")

//importa das rotas PUT
const clienteAlterarRoute = require("./routes/alterar/cliente")
const oficinasAlterarRoute = require("./routes/alterar/oficinas")
const veiculoAlterarRoute = require("./routes/alterar/veiculo")
const funcionarioAlterarRoute = require("./routes/alterar/funcionario")
const OrcamentoAlterarRoute = require("./routes/alterar/orcamento")

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
//GET
app.use("/cliente", clienteRoute)
app.use("/oficinas", oficinasRoute)
app.use("/veiculo", veiculoRoute)
app.use("/funcionario", funcionarioRoute)
app.use("/orcamento", oracamentoRoute)
app.use("/reparo", reparoRoute)
app.use("/servico", servicoRoute)
app.use("/especialidade", especialidadeRoute)
//PUT
app.use("/cliente/alterar", clienteAlterarRoute)
app.use("/oficina/alterar", oficinasAlterarRoute)
app.use("/veiculo/alterar", veiculoAlterarRoute)
app.use("/funcionario/alterar", funcionarioAlterarRoute)
app.use("/orcamento/alterar", OrcamentoAlterarRoute)

//creates a new error if none of the routes are used
app.use((req, res, next) => {
    const erro = new Error("Not Found");
    erro.status = 404;
    next(erro)
})

app.use((error, req, res, next) => {
    res.status = error.status || 500
    return res.send({
        mensagem: error.message + ": Available resources: [oficinas, cliente, veiculo, funcionario, orcamento, reparo, servico, especialidade]" 
    })
})

module.exports = app;