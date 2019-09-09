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
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
          </el-input>
          <el-button
            type="success"
            plain
            @click="dialogFormVisible = true; disabled = false; title = '添加用户'; formData = {}; isShow = true"
          >添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        stripe
        style="width: 100%; max-height: 400px; overflow: scroll; margin-bottom: 20px"
        v-loading="loading"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" width="80"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="150"></el-table-column>
        <el-table-column label="用户状态" width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleSwitchChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">{{scope.row.create_time | fmtDate}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              plain
              size="mini"
              @click="dialogFormVisible = true; formData = scope.row; title = '编辑用户'; disabled = true; isShow = false"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              size="mini"
              @click="handleDelete(scope.row.id)"
              ref="del"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加或修改用户-框 -->
      <el-dialog :title="title" :visible.sync="dialogFormVisible">
        <el-form :model="formData" label-width="100px" :rules="rules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名" :disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" v-show="isShow">
            <el-input v-model="formData.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="电子邮件" prop="email">
            <el-input v-model="formData.email" placeholder="请输入电子邮件地址"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="formData.mobile" placeholder="请输入电话"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="success" @click="handleFunc">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 4, 6, 8, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>ß

<script>
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
      pagenum: 1,
      pagesize: 2,
      total: 0,
      dialogFormVisible: false,
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loading: true,
      disabled: true,
      title: '修改用户',
      isShow: true
    }
  },
  methods: {
    // 获取用户列表
    async getUserMsg () {
      this.loading = true
      const res = await this.$http.get('users', {
        params: {
          query: this.username,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      const data = res.data
      this.loading = false
      const {
        meta: { msg, status }
      } = data
      if (status === 200) {
        const {
          data: { users, total }
        } = data
        this.tableData = users
        this.total = total
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
    },
    // 搜索用户
    handleSearch () {
      this.getUserMsg()
    },
    // 添加用户
    async handleAdd () {
      const {
        body: { meta }
      } = await this.$http.post('users', this.formData)
      if (meta.status === 201) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
      this.formData = {}
      this.getUserMsg()
    },
    // 分页
    handleSizeChange (val) {
      this.pagesize = val
      console.log(`每页 ${val} 条`)
      this.getUserMsg()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      console.log(`当前页: ${val}`)
      this.getUserMsg()
    },
    // 编辑用户
    async handleEdit () {
      const {
        body: { meta }
      } = await this.$http.put(`users/${this.formData.id}`, {
        email: this.formData.email,
        mobile: this.formData.mobile
      })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 判断编辑或添加
    handleFunc () {
      this.dialogFormVisible = false
      if (this.isShow) {
        this.handleAdd()
      } else if (!this.isShow) {
        this.handleEdit()
      }
    },
    // 删除用户
    handleDelete (id) {
      this.$refs.del.$el.blur()
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            body: { meta }
          } = await this.$http.delete(`users/${id}`)
          if (meta.status === 200) {
            this.$message.success(meta.msg)
          } else {
            this.$message.error(meta.msg)
          }
          this.getUserMsg()
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
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
