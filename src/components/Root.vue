<template>
  <div class="root">
    <button @click="createTable">Create table</button>
    <ul>
      <li v-for="table in tables" :key="table">
        <router-link :to="table">
          {{ table }}
        </router-link>
        <button @click="deleteTable(table)">X</button>
      </li>
    </ul>
  </div>
</template>

<script>
import {Socket} from 'phoenix'

export default {
  name: 'Root',
  data () {
    return {
      tables: [],
      socket: null,
      channel: null
    }
  },
  mounted () {
    this.socket = new Socket('ws://localhost:4000/socket', {params: {type: 'viewer'}})

    this.socket.connect()

    // Now that you are connected, you can join channels with a topic:
    this.channel = this.socket.channel('table:lobby', {})
    this.channel.join()
      .receive('ok', resp => { this.tables = resp.tables })
      .receive('error', resp => { console.log('Unable to join', resp) })

    this.channel.on('update', resp => { this.tables = resp.tables })
  },
  methods: {
    createTable () {
      this.channel.push('create', {})
        .receive('ok', resp => { this.tables = resp.tables })
    },
    deleteTable (table) {
      this.channel.push('destroy', {table: table})
        .receive('ok', resp => { this.tables = resp.tables })
    }
  }
}
</script>

<style scoped>
</style>
