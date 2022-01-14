const express = require('express')
const app = express()

app.use(express.json())

app.get('/api', (req, res) => {

    return res.status(200).send({message: 'Api online'})
})

const PORT = process.env.PORT || 3333
app.listen(PORT, ()=> console.log('Executando'))