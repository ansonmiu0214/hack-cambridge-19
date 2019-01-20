const express = require('express')
const http = require('http')
const multer = require('multer')
const bodyParser = require('body-parser')
const uploads = multer({ dest: 'uploads/'})

// Merged controllers with routes to save time at the moment
const { postVideo, queryProgress, getAnalysis, getQuestion, getResponse } = require('./controllers/video')

const PORT = process.env.PORT || 5000
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server).listen(5050)

app.use(bodyParser.json({ limit: '1000mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

// Health check
app.get('/_health', (_, res) => res.send('OK'))

/**
 * Routes 
 * (TODO rename)
 * */

app.get('/post', postVideo)
app.get('/progress', queryProgress)
app.get('/analysis', getAnalysis) 
app.get('/getQuestion', getQuestion)
app.get('/getResponse', getResponse)

app.post('/post', uploads.single('file'), postVideo)


// ---- Socket connection ----
require('./controllers/socketController')(io)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))