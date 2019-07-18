<template>
  <!--  评论列表  -->
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in comments"
        :key="item.com_id.toString()"
      >
        <div slot="icon">
          <img class="avatar" :src="item.aut_photo" alt="">
        </div>
        <div slot="title">
          <span>{{ item.aut_name }}</span>
        </div>
        <div slot="default">
          <van-button icon="like-o" size="mini" plain>赞{{ item.like_count }}</van-button>
        </div>
        <div slot="label">
          <p>{{ item.content }}</p>
          <p>
            <span>{{ item.pubdate | relativeTime }}</span>

            <span>回复{{ item.reply_count }}</span>
          </p>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
export default {
  name: 'CommentList',
  props: {
    articleId: {
      type: [Number, String]
    },
    commentId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      comments: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10
    }
  },
  created () {},
  methods: {
    async onLoad () {
      const data = await getComments({
        source: this.articleId || this.commentId,
        offset: this.offset,
        limit: this.limit,
        isArticle: !!this.articleId // 获取文章评论？还是获取评论的回复
      })
      // 如果数组为空 则表示没有数据
      if (!data.result.length) {
        this.finished = true
        this.loading = false
        return
      }
      // 如果有数据 添加数据
      this.comments.push(...data.result)
      this.loading = false
      // 将本次数据拿到的 last_id保存起来 用于下一次 onLoad
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  margin-right: 10px;
}
</style>
