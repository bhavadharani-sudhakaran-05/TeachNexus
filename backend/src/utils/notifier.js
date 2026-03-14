let io = null

function setIO(serverIo){
  io = serverIo
}

function notifyUser(userId, payload){
  if (!io) return false
  try {
    io.to(`user:${userId}`).emit('notification', payload)
    return true
  } catch (e) {
    console.error('notifyUser failed', e)
    return false
  }
}

module.exports = { setIO, notifyUser }
