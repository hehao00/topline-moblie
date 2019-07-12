<template>
  <div id="app">
    <!--
      路由组件是动态的 默认情况下切换都会销毁重建 状态丢失
      在切换的时候保留状态 则使用 keep-alive 缓存
     -->
    <keep-alive>
       <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',

  data () {
    return {
    }
  },

  methods: {}
}
</script>

<style scoped>

</style>
