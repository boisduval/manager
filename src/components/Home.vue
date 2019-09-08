<template>
  <div class="home">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          unique-opened
        >
          <!-- 用户管理 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <!-- 权限管理 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <!-- 商品管理 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <!-- 订单管理 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <!-- 数据统计 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-container>

        <!-- 头部 -->
        <el-header>
          <el-row
            type="flex"
            class="row-bg"
            justify="end"
          >
            <el-col :span="23">
              <div class="grid-content">
                <h2>电商管理系统</h2>
              </div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content">
                <a href="" @click="signout()">退出</a>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <!-- 主要内容 -->
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  beforeCreate () {
    // 判断是否登录
    if (!localStorage.getItem('token')) {
      this.$message.warning('你还没有登录')
      this.$router.push({
        name: 'login'
      })
    }
  },
  data () {
    return {}
  },
  methods: {
    handleOpen () {
      console.log('handleOpen')
    },
    handleClose () {
      console.log('handleClose')
    },
    signout () {
      localStorage.clear()
    }
  }
}
</script>

<style scoped>
h2 {
  padding: 0;
  margin: 0;
  color: #fff;
}
.home {
  height: 100%;
}

.home .el-container {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  color: #333;
  text-align: left;
  line-height: 300px;
  width: 300px !important;
  margin-top: 100px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}
/* header */
.grid-content {
  border-radius: 4px;
  min-height: 60px;
}

/* aside */
.el-aside span,
.el-aside li {
  font-size: Medium;
}
</style>
