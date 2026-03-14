const WebSocket = require('ws')
const { setupWSConnection } = require('y-websocket/bin/utils')

module.exports = function(server){
  const wss = new WebSocket.Server({ server, path: '/yjs' })
  wss.on('connection', (ws, req) => {
    try {
      setupWSConnection(ws, req)
    } catch (err) {
      console.error('yjs connection error', err)
    }
  })
  console.log('Yjs websocket attached at /yjs')
}
