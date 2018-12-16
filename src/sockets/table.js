import {Socket} from 'phoenix'

let socket = new Socket('ws://localhost:4000/socket', {params: {type: 'viewer'}})

socket.connect()

// Now that you are connected, you can join channels with a topic:
let channel = socket.channel('table:' + $route.params.tableID, {})
channel.join()
  .receive('ok', resp => { console.log('Joined successfully', resp) })
  .receive('error', resp => { console.log('Unable to join', resp) })

export default socket
