<template lang="pug">
  div
    <!-- .columns-->
    <!--   .column-->
    <!--     input(v-model="player")-->
    <!--     button(@click="createPlayer") Add Player-->

    .columns
      .column
        .is-size-3.has-text-centered
          span.has-text-weight-bold Table:
          span  {{ table.id }}
    .columns(v-if="viewedGame !== undefined")
      .column.players
        .title.is-4 Players
        div(v-if="viewedAction !== undefined")
          .columns.is-multiline.is-vcentered
            .column(v-for="(player, playerIndex) in viewedAction.state.players" :key="player.id")
              .card
                .card-header
                  .card-header-title.is-centered {{ player.name }}
                  .card-header-icon(v-if="playerIndex === viewedAction.state.dealer")
                    span.icon.has-text-primary
                      .fas.fa-usd-circle
                  .card-header-icon(v-if="playerIndex === viewedAction.state.active_player")
                    span.icon.has-text-info
                      .fas.fa-user-circle
                .card-content
                  .columns
                    .column(v-for="card in player.hand" :key="card")
                      card.container(:card="card")
                .card-footer
                  .card-footer-item.has-space-between
                    span.icon
                      .fal.fa-coins
                    div {{ player.chips }}
                  .card-footer-item.has-space-between
                    span.icon
                      .fal.fa-hand-holding-usd
                    div {{ player.to_call }}

      .column.info
        .columns
          .column
            a.icon(@click="firstGame")
              .fal.fa-chevron-double-left
            a.icon(@click="previousGame")
              .fal.fa-chevron-left
            span.title.is-5
              | Games
              | {{ games.length - selectedGame }}
              | /
              | {{ games.length }}
            a.icon(@click="nextGame")
              .fal.fa-chevron-right
            a.icon(@click="lastGame")
              .fal.fa-chevron-double-right
          .column
            a.icon(@click="firstRound")
              .far.fa-chevron-double-left
            a.icon(@click="previousRound")
              .far.fa-chevron-left
            span.title.is-5
              | Round
              | {{ rounds.length - selectedRound }}
              | /
              | {{ rounds.length }}
            a.icon(@click="nextRound")
              .far.fa-chevron-right
            a.icon(@click="lastRound")
              .far.fa-chevron-double-right
        div(v-if="viewedAction !== undefined")
          .columns
            .column
              div Stage
              div {{ viewedAction.state.stage }}
            .column
              div Pot
              div {{ viewedAction.state.pot }}
            .column
              div Board
              .columns
                .column(v-for="card in viewedAction.state.board" :key="card")
                  card.container(:card="card")
          nav.panel
            .panel-heading Actions
            .panel-block(v-for="(action, ai) in actions" :key="ai" @click="selectAction(ai)" :class="{'is-active':selectedAction == ai}")
              .is-one-quarter
                span.tag {{ action.action }}
              | {{ action.msg }}
</template>

<script>
import {Socket} from 'phoenix'
import Card from '@/components/Card'

export default {
  name: 'Table',
  data () {
    return {
      table: { players: [], round: {}, game: {} },
      player: '',
      socket: null,
      channel: null,
      selectedAction: 0,
      selectedGame: 0,
      selectedRound: 0
    }
  },
  components: { Card },

  computed: {
    games () {
      return [this.table.game].concat(this.table.games)
    },
    rounds () {
      if (this.selectedGame == 0) {
        return [this.table.round].concat(this.viewedGame.rounds)
      } else {
        return this.viewedGame.rounds
      }
    },
    actions () {
      return this.viewedRound.actions
    },
    viewedGame () {
      return this.games[this.selectedGame]
    },
    viewedRound () {
      return this.rounds[this.selectedRound]
    },
    viewedAction () {
      return this.actions[this.selectedAction]
    }
  },

  mounted () {
    this.socket = new Socket('ws://localhost:4000/socket', {params: {type: 'viewer'}})

    this.socket.connect()

    this.channel = this.socket.channel('table:' + this.$route.params.tableId, {})
    this.channel.join()
      .receive('ok', resp => { this.table = resp.table })
      .receive('error', resp => { console.log('Unable to join', resp) })

    this.channel.on('update', resp => { this.table = resp.table })
  },

  created () {
    this.$parent.$on('start', this.start)
    this.$parent.$on('stop', this.stop)
  },

  methods: {
    createPlayer () {
      this.channel.push('create_player', { player: this.player })
        .receive('ok', resp => { this.table = resp.table })
    },
    start () {
      this.channel.push('start', {})
    },
    stop () {
      this.channel.push('stop', {})
    },
    selectAction (index) {
      this.selectedAction = index
    },
    nextRound () {
      this.selectedAction = 0
      this.selectedRound = this.selectedRound - 1
    },
    previousRound () {
      this.selectedAction = 0
      this.selectedRound = this.selectedRound + 1
    },
    firstRound () {
      this.selectedAction = 0
      this.selectedRound = this.rounds.length - 1
    },
    lastRound () {
      this.selectedAction = 0
      this.selectedRound = 0
    },
    nextGame () {
      this.selectedAction = 0
      this.selectedRound = 0
      this.selectedGame = this.selectedGame - 1
    },
    previousGame () {
      this.selectedAction = 0
      this.selectedRound = 0
      this.selectedGame = this.selectedGame + 1
    },
    firstGame () {
      this.selectedAction = 0
      this.selectedRound = 0
      this.selectedGame = this.games.length - 1
    },
    lastGame () {
      this.selectedAction = 0
      this.selectedRound = 0
      this.selectedGame = 0
    }
  }
}
</script>

<style lang="scss">
.is-vertical {
  flext-direction: column;
}
.has-space-between {
  justify-content: space-between;
}
.is-one-quarter {
  width: 20%;
}
</style>
