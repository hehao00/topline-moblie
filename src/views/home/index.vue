<template>
  <div>
    <van-nav-bar class="nav-bar" title="首页" fixed/>
    <!-- tab标签 -->
    <van-tabs class="channel-tabs" v-model="activeName">
  <van-tab  title="推荐">
    <!-- 下拉刷新 -->
    <!--
      下拉刷新组件
      isLoading 控制下拉的 loading 状态
      refresh 下拉之后触发的事件
     -->
   <van-pull-refresh v-model="pullRefreshLoading" @refresh="onRefresh">
    <!-- list列表 -->
    <!--
      loading 控制加载更多的loading状态
      finished 控制是否已加载结束
      onLoad 事件会在滚动到底部区域的时候自动调用 每次onLoad 它会自动让loading 为true
     -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item"
        :title="item"
      />
    </van-list>
     </van-pull-refresh>
  </van-tab>
  <van-tab title="热门话题" >热门话题</van-tab>
  <van-tab title="科技动态">科技动态</van-tab>
  <van-tab title="标签 4">内容 4</van-tab>
  <van-tab title="标签 5">内容 5</van-tab>
</van-tabs>
<!-- 底部 -->
<van-tabbar>
  <van-tabbar-item icon="wap-home" to="/">首页</van-tabbar-item>
  <van-tabbar-item icon="comment-o" to="/qa">问答</van-tabbar-item>
  <van-tabbar-item icon="video-o" to="/video">视频</van-tabbar-item>
  <van-tabbar-item icon="manager-o" to="/my">我的</van-tabbar-item>
</van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'HomeIndex',

  data () {
    return {
      activeName: 0,
      list: [],
      loading: false,
      finished: false,
      pullRefreshLoading: false
    }
  },

  methods: {
    onLoad () {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 500)
    },
    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.pullRefreshLoading = false
        this.count++
      }, 500)
    }
  }
}

</script>

<style lang="less" scoped>
.nav-bar {
    background-color: #3296fa;
}
.van-nav-bar__title {
  color: #fff;
}
.channel-tabs {
  margin-bottom:100px;
}
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 100px;
}
.channel-tabs /deep/ .van-tabs__content {
  top: 100px;
}
</style>
