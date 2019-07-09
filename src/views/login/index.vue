<template>
  <div>
      <!-- 头部 -->
      <van-nav-bar class="nav-bar" title="登陆"/>
      <!--表单 -->
      <van-cell-group>
        <van-field
            v-model="user.mobile"
            required
            clearable
            label="手机号"
            placeholder="请输入手机号"
        />
        <van-field
            v-model="user.code"
            label="验证码"
            placeholder="请输入验证码"
            required
        />
     </van-cell-group>
     <!-- 登陆按钮 -->
     <div class="login-btn">
         <van-button
         class="btn"
         type="info"
         @click.prevent="handleLogin"
         :loading="loginLoading"
         loading-text="登陆中..."
         >登陆</van-button>
     </div>

  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',

  data () {
    return {
      user: {
        mobile: '17635146322',
        code: '123456'
      },
      loginLoading: false // 控制登陆
    }
  },

  methods: {
    async handleLogin () {
      this.loginLoading = true
      try {
        const data = await login(this.user)
        console.log(data)
        this.$store.commit('setUser', data)
        // 跳转到首页
        this.$router.push({ name: 'home' })
      } catch (err) {
        console.log(err)
        console.log('登陆失败')
      }
      this.loginLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar__title {
    color:#fff;
}
.nav-bar {
    background-color: #3296fa;
}
.btn {
    width:100%;
    border-radius: 5px;
}
.login-btn {
    padding:20px;
}
</style>
