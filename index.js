const express = require('express')
const http = require('http')
const cors = require('cors')
const { createClient } =  require('redis')
require('dotenv').config()

const app = express()
const server = http.Server(app)
const port = process.env.PORT || 8000

app.use(cors())

app.get('/', async (req, res) => {
    const client = createClient({
        url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}`
    });
    client.on('error', (err) => console.log('Redis Client Error', err));
    console.log('Connecting')
    await client.connect();
    console.log('Fetching Word...')
    const successfulWord = await client.get('word_of_day')
    await client.quit()
    return res.json({
        word: successfulWord,
    })
})

server.listen(port, () => {
    console.log('Server is now listening on port ' + port)
})