<template>
  <div>
    <van-nav-bar class="nav-bar" title="首页" fixed/>
    <!-- tab标签 -->
    <van-tabs class="channel-tabs" v-model="activeChannelIndex">
      <div slot="nav-right" class="wap-nav" @click="isChannelShow = true">
        <van-icon name="wap-nav"></van-icon>
      </div>
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
   <van-pull-refresh
   v-model="pullRefreshLoading"
   @refresh="onRefresh"
   :success-duration="1000"
   :success-text="channelItem.downPullSuccessText"
   >
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
<!-- 频道组件 -->
<!--
  :value="isChannelShow"
 -->
  <home-channel
  v-model="isChannelShow"
  :user-channels="channels"
  :active-index="activeChannelIndex"
  ></home-channel>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import HomeChannel from './components/channel'
export default {
  name: 'HomeIndex',
  components: {
    HomeChannel
  },
  data () {
    return {
      channels: [],
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      pullRefreshLoading: false,
      isChannelShow: false // 控制频道面板的显示状态
    }
  },
  computed: {
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },
  watch: {
    /**
     * 监视容器中的user的状态 只要user发送改变 就重新获取频道列表
     * 凡是能this.出来的都可以监视
     */
    async '$store.state.user' () {
      // 重新加载频道数据
      await this.loadChannels()
      // 由于重新加载了频道数据 所以文章内容也都清空了
      // 而且上拉加载更多的 onLoad 没有主动触发
      // 手动触发上拉加载更多的onLoad
      // 只需将当前激活频道的上拉 loading 设置为 true 会自动调用自己的onLoad 函数
      this.activeChannel.upLoading = true
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
      const { activeChannel } = this
      // 备份加载下一页数据的时间戳
      const timestamp = activeChannel.timestamp
      // 使用最新时间戳去请求最新的推荐数据
      activeChannel.timestamp = Date.now()
      const data = await this.loadArticles()
      // 如果有最新数据，将数据更新到频道的文章列表中
      if (data.results.length) {
        // 将当前最新的推荐内容重置到频道文章中
        activeChannel.articles = data.results
        // 由于你重置了文章列表，那么当前数据中的 pre_timestamp 就是上拉加载更多的下一页数据的时间戳
        activeChannel.timestamp = data.pre_timestamp
        activeChannel.downPullSuccessText = '更新成功'
        // 当下拉刷新有数据并重置以后数据无法满足一屏，所以我们使用 onLoad 再多加载一页数据
        this.onLoad()
      } else {
        // 如果没有最新数据，提示已是最新内容
        activeChannel.downPullSuccessText = '已是最新数据'
      }
      // 下拉刷新结束，取消 loading 状态
      activeChannel.downPullLoading = false
      // 没有最新数据，将原来的用于请求下一页的时间戳恢复过来
      activeChannel.timestamp = timestamp
    },
    // async loadChannels () {
    //   try {
    //     let channels = []
    //     const localChannels = window.localStorage.getItem('channels')
    //     // 如果有本地存储的频道列表，则使用本地的
    //     if (localChannels) {
    //       channels = localChannels
    //     } else {
    //       channels = (await getUserChannels()).channels
    //     }
    //     // 对频道中的数据统一处理以供页面使用
    //     channels.forEach(item => {
    //       item.articles = [] // 频道的文章
    //       item.timestamp = Date.now() // 用于下一页频道数据的时间戳
    //       item.finished = false // 控制该频道上拉加载是否已加载完毕
    //       item.upLoading = false // 控制该频道的下拉刷新 loading
    //       item.pullRefreshLoading = false // 控制频道列表的下拉刷新状态
    //       item.pullSuccessText = '' // 控制频道列表的下拉刷新成功提示文字
    //     })
    //     this.channels = channels
    //   } catch (err) {
    //     console.log(err)
    //   }
    // },
    async loadChannels () {
      let channels = []
      // 得到频道数据
      const { user } = this.$store.state
      // 如果已登录 则请求用户频道列表
      if (user) {
        channels = (await getUserChannels()).channels
      } else {
        // 如果没有登陆
        // 判断是否有本地存储的判断列表
        const localChannels = JSON.parse(window.localStorage.getItem('channels'))
        // 如果有 则使用
        if (localChannels) {
          channels = localChannels
        } else {
          // 如果没有 则请求获取推荐的默认频道列表
          channels = (await getUserChannels()).channels
        }
      }
      // 扩展频道数据满足其他业务需求
      channels.forEach(item => {
        item.articles = [] // 频道的文章
        item.timestamp = Date.now() // 用于下一页频道数据的时间戳
        item.finished = false // 控制该频道上拉加载是否已加载完毕
        item.upLoading = false // 控制该频道的下拉刷新 loading
        item.pullRefreshLoading = false // 控制频道列表的下拉刷新状态
        item.pullSuccessText = '' // 控制频道列表的下拉刷新成功提示文字
      })
      this.channels = channels
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
.channel-tabs .wap-nav {
  position: sticky;
  right: 0;
  display: flex;
  align-items: center;
  background: #fff;
  opacity: .7;
}
</style>
