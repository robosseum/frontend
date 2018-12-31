<template lang="pug">
  #app
    .navbar.is-primary
      .navbar-menu
        .navbar-end
          .navbar-item
            .buttons
              .button.is-light(v-if="$route.name === 'Table'" @click="start")
                | Start
              .button.is-danger(v-if="$route.name === 'Table'" @click="stop")
                | Stop
    .section
      .container
        router-view
</template>

<script>
export default {
  name: 'App',
  methods: {
    start () {
      this.$emit('start')
    },
    stop () {
      this.$emit('stop')
    }
  }
}
</script>

<style>
</style>
