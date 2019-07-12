<template>
 <van-popup
  v-model="show"
  position="bottom"
  :style="{ height: '95%' }"
/>
</template>

<script>
export default {
  name: 'HomeChannel',
  props: {},
  data () {
    return {
      show: true
    }
  },

  methods: {}
}
</script>

<style scoped>

</style>
