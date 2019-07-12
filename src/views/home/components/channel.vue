<template>
<!--
    v-model 是：
     v-bind:value="数据"
     v-on:input="数据=$event"
 -->
 <van-popup
  :value="value"
  @input="$emit('input', $event)"
  position="bottom"
  :style="{ height: '95%' }"
/>
</template>

<script>
export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },

  methods: {}
}
</script>

<style scoped>

</style>
