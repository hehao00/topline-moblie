<template>
  <div>
    <van-nav-bar class="nav-bar" title="首页" fixed/>
    <!-- tab标签 -->
    <van-tabs class="channel-tabs" v-model="activeChannelIndex">
  <van-tab
    v-for="channelItem in channels"
    :key="channelItem.id"
    :title="channelItem.name"
  >
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
      v-model="channelItem.upPullLoading"
      :finished="channelItem.upPullFinished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="articleItem in channelItem.articles"
        :key="articleItem.art_id"
        :title="articleItem.title"
      />
    </van-list>
     </van-pull-refresh>
  </van-tab>
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
import { getUserChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
export default {
  name: 'HomeIndex',
  data () {
    return {
      channels: [],
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      pullRefreshLoading: false
    }
  },
  computed: {
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },
  async created () {
    // 加载频道列表
    await this.loadChannels()
    // 初始加载第1项频道的数据列表
    // 注意：务必在记载频道之后
    // this.loadArticles()
  },
  methods: {
    /**
     * 上拉加载更多，应该往频道的 articles 中最后 push 数据
     * onLoad 一上来就会自动调用，当请求的数据不够一屏的时候，它会多次调用
     * onLoad 会自动开启加载 loading 效果
     */
    async onLoad () {
      let data = []
      data = await this.loadArticles()
      // 如果没有最新数据，则请求上一次的数据
      if (data.pre_timestamp && data.results.length === 0) {
        // 将最近的推荐数据请求的时间戳更新到频道中
        this.activeChannel.timestamp = data.pre_timestamp
        // 加载下一页数据
        data = await this.loadArticles()
      }
      // 数据加载好以后 将pre_timestamp更新到当前频道中用于加载下页数据
      this.activeChannel.timestamp = data.pre_timestamp
      // 将文章更新到频道中
      this.activeChannel.articles.push(...data.results)
      // 数据加载完毕 取消上拉的loading
      this.activeChannel.upPullLoading = false
    },
    /**
     * 下拉刷新
     */
    async onRefresh () {
      // 获取最新数据
      const data = await getArticles({
        channelId: this.activeChannel.id,
        timestamp: Date.now(),
        withTop: 1
      })
      // 如果有最新数据
      if (data.results.length) {
        // 将最新数据重置到当前频道
        this.activeChannel.articles = data.results
        this.activeChannel.timestamp = data.pre_timestamp
        this.activeChannel.pullSuccessText = '更新完成'
        // 因为最新数据无法撑满一页，所以使用加载更多再请求一次
        this.onLoad()
      }
      this.activeChannel.pullSuccessText = '暂无数据更新'
      // 无论如何，最后都关闭加载状态
      this.activeChannel.pullRefreshLoading = false
    },
    async loadChannels () {
      try {
        let channels = []
        const localChannels = window.localStorage.getItem('channels')
        // 如果有本地存储的频道列表，则使用本地的
        if (localChannels) {
          channels = localChannels
        } else {
          channels = (await getUserChannels()).channels
        }
        // 对频道中的数据统一处理以供页面使用
        channels.forEach(item => {
          item.articles = [] // 频道的文章
          item.timestamp = Date.now() // 用于下一页频道数据的时间戳
          item.finished = false // 控制该频道上拉加载是否已加载完毕
          item.upLoading = false // 控制该频道的下拉刷新 loading
          item.pullRefreshLoading = false // 控制频道列表的下拉刷新状态
          item.pullSuccessText = '' // 控制频道列表的下拉刷新成功提示文字
        })
        this.channels = channels
      } catch (err) {
        console.log(err)
      }
    },
    async loadArticles () {
      const { id: channelId, timestamp } = this.activeChannel
      const data = await getArticles({
        channelId, // 当前激活频道id
        timestamp, // 当前频道下一页数据的时间戳
        withTop: 1 // 是否包含置顶数据
      })
      return data
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
  margin-bottom:92px;
}
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 92px;
}
.channel-tabs /deep/ .van-tabs__content {
  top: 92px;
}
</style>
