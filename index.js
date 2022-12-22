const express = require('express')
const routes = require('./src/routes')
const cors = require('cors')

require('dotenv').config()
require('./src/database')

const app = express() // Inicia o servidor express

app.use(cors())
app.use(express.json()) // "Fala" pro servidor que ele estará trabalhando com requisições do tipo Json
app.use(routes) // Add as rotas criadas

const port = process.env.PORT
app.listen(port) // Abre o servidor na porta informada
console.log(`O servidor foi iniciado com sucesso!`)