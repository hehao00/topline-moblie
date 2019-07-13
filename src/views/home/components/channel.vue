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
  get-container="body"
  :style="{ height: '95%' }"
>
 <!-- 我的频道 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button
            type="danger"
            plain
            size="mini"
          >编辑</van-button>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item
          v-for="(item, index) in userChannels"
          :key="item.id"
        >
          <span
          class="text"
          :class="{ active: index === activeIndex }"
          >{{ item.name }}</span>
          <van-icon class="close-icon" name="close" />
        </van-grid-item>
      </van-grid>
    </div>
    <!-- /我的频道 -->

    <!-- 推荐频道 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item
          v-for="item in recommendChannels"
          :key="item"
          @click="handleAllChannels(item)"
        >
          <div class="info">
            <span class="text">{{ item.name }}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- /推荐频道 -->
  </van-popup>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userChannels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      allChannels: []
    }
  },
  computed: {
    /**
      该计算属性用于处理获取推荐数据  不包含用户频道列表的其他所有频道列表
      map 会在内部建立一个新数组 每遍历一次就会往新数组push一个
      includes 判断一个数组是否包含指定元素
      计算属性也拥有watch的功能 作用是用于当数据改变之后重新计算返回一些数据
     */
    recommendChannels () {
      // 拿到重复的id
      const duplicates = this.userChannels.map(item => item.id)
      return this.allChannels.filter(item => !duplicates.includes(item.id))
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    // 获取所有频道列表数据
    async loadAllChannels () {
      try {
        const data = await getAllChannels()
        this.allChannels = data.channels
        // console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    // 点击添加频道
    handleAllChannels (item) {
      // userChannels是 props 数据
      // props数据： 单向数据流
      // 数据只受父组件影响 但是反之不会  引用类型除外  最好不要利用这个特点
      // 建议做法将数据传递给父组件 让组件自己去修改
      this.userChannels.push(item)
    }
  }
}
</script>

<style lang="less" scoped>
    .channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
  }
  .channel-content {
    .text {
      font-size: 24px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 40px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
