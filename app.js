require("dotenv").config()
const express = require("express")
const path = require("path")
const cors = require("cors")

const port = process.env.PORT;

const app = express()

//configuração para aceitar respostas do tipo JSON e FORMDATA
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// definindo diretorio de upload de imagens
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

//resolvendo CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))

//conexão com o banco de dados
require("./config/db.js");

// rotas
const router = require("./routes/Router.js")
app.use(router);

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`)
});