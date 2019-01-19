const express = require('express')

// Merged controllers with routes to save time at the moment
const { postVideo, queryProgress, getAnalysis } = require('./controllers/video')

const PORT = process.env.PORT || 5000
const app = express()

// Health check
app.get('/_health', (_, res) => res.send('OK'))

/**
 * Routes 
 * (TODO rename)
 * */

app.get('/post', postVideo)
app.get('/query', queryProgress)
app.get('/analysis', getAnalysis)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))