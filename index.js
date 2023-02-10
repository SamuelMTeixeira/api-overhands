const express = require('express')
const routes = require('./src/routes')
const cors = require('cors')

require('dotenv').config()
require('./src/database')

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.clear()
    console.log(`🚀 Server running on port ${port}`)
});
