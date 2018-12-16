<template>
  <div>
    <h1> Table: {{ table.id }}</h1>
    <input v-model="player">
    <button @click=createPlayer>Add Player</button>
    <button @click=start>Start</button>
    <h3> Players </h3>
    <div v-if="table.game !== null">
      <table>
        <thead>
          <th v-for="column in playerKeys" :key="column"> {{ column }}</th>
        </thead>
        <tbody>
          <tr v-for="player in table.game.players" :key="player.id">
            <td v-for="column in Object.keys(player)" :key="column"> {{ player[column] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <table>
        <thead>
          <th v-for="column in playerKeys" :key="column"> {{ column }}</th>
        </thead>
        <tbody>
          <tr v-for="player in table.players" :key="player.id">
            <td v-for="column in Object.keys(player)" :key="column"> {{ player[column] }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <h4>Round:</h4>

      <table>
        <thead>
          <th>Stage</th>
          <th>Pot</th>
          <th>Active Player</th>
          <th>Board</th>
        </thead>
        <tr v-if="table.round !== null">
          <td> {{ table.round.stage }} </td>
          <td> {{ table.round.pot }} </td>
          <td> {{ table.round.active_player }} </td>
          <td> {{ table.round.board }} </td>
        </tr>
      </table>

      <h5>Actions:</h5>
      <ul v-if="table.round !== null">
        <li v-for="action in table.round.actions" :key="action">{{ action }}</li>
      </ul>
    </div>

    <div>
      <div v-if="table.game !== null">
        <h4>Game:</h4>
        <table>
          <thead>
            <th>Dealer</th>
            <th>Blind</th>
          </thead>
          <tr >
            <td> {{ table.game.dealer }} </td>
            <td> {{ table.game.blind }} </td>
          </tr>
        </table>
        <div>
          <h4>All Actions:</h4>
          <ul v-if="table.game.rounds !== null">
            <div v-for="round in table.game.rounds" :key="round">
              <hr>
              <li v-for="action in round.actions" :key="action">{{ action }}</li>
            </div>
          </ul>
        </div>
      </div>

      <h4>Table:</h4>
      <pre>
        {{table}}
      </pre>
    </div>

  </div>
</template>

<script>
import {Socket} from 'phoenix'

export default {
  name: 'Table',
  data () {
    return {
      table: { players: [], round: {}, game: {} },
      player: '',
      socket: null,
      channel: null
    }
  },
  computed: {
    playerKeys () {
      if (this.table.players.length === 0) {
        return []
      } else {
        return Object.keys(this.table.players[0])
      }
    }
  },
  mounted () {
    this.socket = new Socket('ws://localhost:4000/socket', {params: {type: 'viewer'}})

    this.socket.connect()

    this.channel = this.socket.channel('table:' + this.$route.params.tableId, {})
    this.channel.join()
      .receive('ok', resp => { console.log(resp.table); this.table = resp.table })
      .receive('error', resp => { console.log('Unable to join', resp) })

    this.channel.on('update', resp => { this.table = resp.table })
  },
  methods: {
    createPlayer () {
      this.channel.push('create_player', { player: this.player })
        .receive('ok', resp => { this.table = resp.table })
    },
    start () {
      this.channel.push('start', {})
    }
  }
}
</script>
