const online = new Set() 

module.exports = function(io) {

  io.on('connection', socket => {
    const id = socket.id
    console.log(`${socket.id} connected`)

    socket.emit('ack', { id: id })

    // for (let other of online) {
    //   // Broadcast to all others
    //   other.emit('child_added', { sender: id, })
    // }

    online.add(socket)

    socket.on('send', data => {
      console.log(data)

      for (let other of online) {
        // Broadcast to all others
        other.emit('child_added', { sender: id, data: data})
      }
    })

    socket.on('disconnect', () => {
      console.log(`${socket.id} DISconnected`)
      online.delete(socket)
    })
  })

}