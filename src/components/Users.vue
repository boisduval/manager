<template>
  <div class="main">
    <el-card class="box-card">
      <!-- 面包屑组件 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 搜索栏 -->
      <el-row class="searchArea">
        <el-col :span="24">
          <el-input placeholder="请输入用户名" v-model="username" class="searchInput">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="success" plain>添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" width="80"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleSwitchChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
// import { async } from 'q'
export default {
  http: {
    headers: {
      Authorization: window.localStorage.getItem('token')
    }
  },
  created () {
    this.getUserMsg()
  },
  data () {
    return {
      tableData: [],
      username: '',
      pagenum: '',
      pagesize: ''
    }
  },
  methods: {
    // 获取用户列表
    async getUserMsg () {
      const res = await this.$http.get('users', {
        params: {
          pagenum: 1,
          pagesize: 10
        }
      })
      const data = res.data
      const {
        meta: { msg, status }
      } = data
      if (status === 200) {
        const {
          data: { users }
        } = data
        this.tableData = users
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },
    // 修改用户状态
    async handleSwitchChange (user) {
      const {
        body: { meta }
      } = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style scoped>
.main,
.box-card {
  height: 100%;
}
.input-with-select {
  width: 300px;
}
.searchArea {
  margin-top: 20px;
  margin-bottom: 10px;
  text-align: left;
}
.searchArea .searchInput {
  width: 350px;
}
</style>
