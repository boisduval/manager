<template>
  <div class="home">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          :default-active="this.$route.path"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          unique-opened
          :router="true"
        >
          <el-submenu :index="''+item.order" v-for="(item, index) in asideItem" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item v-for="(item1, index1) in item.children" :key="index1" :index="'/'+item1.path">
              <i class="el-icon-menu"></i>
              {{item1.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <el-header>
          <el-row type="flex" class="row-bg" justify="end">
            <el-col :span="23">
              <div class="grid-content">
                <h2>电商管理系统</h2>
              </div>
            </el-col>
            <el-col :span="1">
              <div class="grid-content">
                <a href @click="signout()">退出</a>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <!-- 主要内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    // 判断是否登录
    if (!sessionStorage.getItem("token")) {
      this.$message.warning("你还没有登录");
      this.$router.push({
        name: "login"
      });
    }
  },
  created() {
    this.getAsideItem();
  },
  data() {
    return {
      asideItem: []
    };
  },
  methods: {
    handleOpen() {
      console.log("handleOpen");
    },
    handleClose() {
      console.log("handleClose");
    },
    signout() {
      sessionStorage.clear();
    },
    // 获取左侧列表权限
    async getAsideItem() {
      const res = await this.$http.get(`menus`);
      const {
        data: { data }
      } = res;
      this.asideItem = data;
    }
  }
};
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
  font-size: small;
}
</style>
