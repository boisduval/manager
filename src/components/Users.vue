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
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="mg_state" label="用户状态"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
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
    async getUserMsg () {
      const res = await this.$http.get('users', {
        headers: {
          Authorization: window.localStorage.getItem('token')
        },
        params: {
          pagenum: 1,
          pagesize: 10
        }
      })
      console.log(res)
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
