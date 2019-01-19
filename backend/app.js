const express = require('express')

const PORT = process.env.PORT || 5000
const app = express()

app.get('/_health', (_, res) => res.send('OK'))

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))