<template>
  <div class="article-wrap">
      <van-nav-bar
       title="黑马头条"
       left-text="返回"
       left-arrow
       @click-left="$router.back()"
      />
      <h2 class="article-title">{{ article.title }}</h2>
    <AuthInfo class="auth-info"
        :article="article"
     />
    <div class="ariticle-content" v-html="article.content">
       <p>hello</p>
    </div>
    <MoreAction :article="article" />
    <CommentList :article-id="$route.params.articleId"/>
    <ReplyList />
    <WriteComment />
  </div>
</template>

<script>
import AuthInfo from './components/auth-info'
import CommentList from './components/comment-list'
import MoreAction from './components/more-action'
import ReplyList from './components/reply-list'
import WriteComment from './components/write-comment'
import { getArticlesDetail } from '@/api/article'
export default {
  name: 'ArticleIndex',
  components: {
    AuthInfo,
    CommentList,
    MoreAction,
    ReplyList,
    WriteComment
  },
  data () {
    return {
      article: {
        art_id: 23861,
        attitude: null,
        aut_id: 2,
        aut_name: '13552285417',
        aut_photo: '',
        ch_id: 13,
        content: `<p/>摘要：在图像分析中，卷积神经网络</p>`,
        is_collected: false,
        is_followed: true,
        pubdate: '2018-11-29T15:22:27',
        recomments: [],
        title: '全连接网络到卷积神经网络逐步推导（组图无公式）'
      }
    }
  },
  created () {
    this.loadArticleDetail()
  },
  methods: {
    // 获取新闻文章详情
    async loadArticleDetail () {
      try {
        const data = await getArticlesDetail(this.$route.params.articleId)
        this.article = data
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-wrap {
    padding: 20px;
    .article-title {
        font-size: 50px;
        font-weight: 400;
    }
    .ariticle-content {
        font-size: 24px;
    }
    .auth-info {
        position: sticky;
        top: 0;
        background-color: #fff;
    }
}
</style>
