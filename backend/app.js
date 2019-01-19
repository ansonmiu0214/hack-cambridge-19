const express = require('express')

// Merged controllers with routes to save time at the moment
const { postVideo } = require('./controllers/video')

const PORT = process.env.PORT || 5000
const app = express()

// Health check
app.get('/_health', (_, res) => res.send('OK'))

/**
 * Routes 
 * */

app.get('/foo', postVideo)    // TODO rename

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))