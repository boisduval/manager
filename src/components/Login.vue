<template>
  <div class="login">
    <div class="login-wrap">
      <h3>用户登录</h3>
      <el-form label-position="top" label-width="80px" :model="fomdata" class="form" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="fomdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="fomdata.password" show-password type="password"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="btn" @click="handleLogin()">登录</el-button>
    </div>
  </div>

</template>

<script>
export default {
  data () {
    var checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }

    var checkPsd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }

    return {
      fomdata: {
        username: '',
        password: ''
      },
      rules: {
        // 这里的key要跟组件的v-model的key一样
        username: [{
          validator: checkName,
          trigger: 'blur'
        }],

        password: [{
          validator: checkPsd,
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    async handleLogin () {
      const {body: {meta: {status, msg}, data: {token}}} = await this.$http.post('login', this.fomdata)
      if (status === 200) {
        this.$message.success(msg)
        setTimeout(() => {
          this.$router.push('/')
        }, 1000)
        // 存入token
        localStorage.setItem('token', token)
      } else if (status === 400) {
        this.$message.error(msg)
      }
    }
  }
}

</script>

<style scoped>
  .login {
    height: 100%;
    background-color: rgb(8, 35, 109);
    display: flex;
    justify-content: center;
    align-items: center
  }

  .login-wrap {
    width: 450px;
    height: 350px;
    background-color: #fff;
    padding: 30px;
    border-radius: 4px
  }

  .login-wrap .btn {
    width: 100%;
  }

</style>
