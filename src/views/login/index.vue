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
            :error-message="errors.mobile"
        />
        <van-field
            v-model="user.code"
            label="验证码"
            placeholder="请输入验证码"
            required
            :error-message="errors.code"
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
      loginLoading: false, // 控制登陆
      errors: {
        mobile: '',
        code: ''
      }
    }
  },

  methods: {
    async handleLogin () {
      this.loginLoading = true
      try {
        // 发送请求前 校验表单数据 校验通过发送请求
        const { mobile, code } = this.user
        const errors = this.errors
        // if (mobile.length){
        //     errors.mobile = ''
        // } else {
        //     errors.mobile = '手机号不能为空'
        //  return
        // }
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (myreg.test(mobile)) {
          errors.mobile = ''
        } else {
          errors.mobile = '手机号格式不正确'
        }
        var reg = reg = /^\d{6}$/
        if (reg.test(code)) {
          errors.code = ''
        } else {
          errors.code = '验证码有误'
        }
        const data = await login(this.user)
        // console.log(data)
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
