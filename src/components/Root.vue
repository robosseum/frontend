<template lang="pug">
  .root
    button.button.is-primary(@click="createTable") Create table
    ul
      li(v-for="table in tables" :key="table")
        router-link(:to="table.id") {{ table.id }}
        button.button.is-danger(@click="deleteTable(table)")
          span.icon
            .fal.fa-trash-alt
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
