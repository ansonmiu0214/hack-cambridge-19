const express = require('express')
const http = require('http')

// Merged controllers with routes to save time at the moment
const { postVideo, queryProgress, getAnalysis, getQuestion, getResponse } = require('./controllers/video')

const PORT = process.env.PORT || 5000
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server).listen(5050)

// Health check
app.get('/_health', (_, res) => res.send('OK'))

/**
 * Routes 
 * (TODO rename)
 * */

app.get('/post', postVideo)
app.get('/query', queryProgress)
app.get('/analysis', getAnalysis) 
app.get('/getQuestion', getQuestion)
app.get('/getResponse', getResponse)

// ---- Socket connection ----
require('./controllers/socketController')(io)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))