<template>
  <div class="main">
    <el-card class="box-card">
      <!-- 面包屑组件 -->
      <my-breadcrumb level1="用户管理" level2="用户列表"></my-breadcrumb>
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
        <el-table-column prop="id" label="#" width="80"></el-table-column>
        <el-table-column prop="username" label="姓名" width="120"></el-table-column>
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
            <!-- 分配用户角色 -->
            <el-button
              type="success"
              icon="el-icon-check"
              circle
              plain
              size="mini"
              @click="handleRole(scope.row.id)"
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
      <!-- 分配角色框 -->
      <el-dialog title="分配用户角色" :visible.sync="dialogFormVisibleRole" width="40%">
        <el-form :model="role">
          <el-form-item label="用户名" id="name" :label-width="formLabelWidth">{{role.username}}</el-form-item>
          <el-form-item label="角色" :label-width="formLabelWidth">
            <div id="role">
              {{currUserRId}}
              <el-select v-model="currUserRId" size="medium">
                <!-- 请选择              -->
                <el-option label="请选择" :value="-1" disabled></el-option>
                <el-option
                  v-for="(item, i) in roleList"
                  :key="i"
                  :label="item.roleName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
          <el-button type="primary" @click="handleEditRole">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>ß

<script>
export default {
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
      isShow: true,
      dialogFormVisibleRole: false,
      role: {},
      currUserRId: -1,
      formLabelWidth: '80px',
      roleList: []
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
      const {
        data: { data, meta }
      } = res
      this.loading = false
      if (meta.status === 200) {
        const { users, total } = data
        this.tableData = users
        this.total = total
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 修改用户状态
    async handleSwitchChange (user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      )
      const {
        data: { meta }
      } = res
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
      console.log(res)
    },
    // 搜索用户
    handleSearch () {
      this.getUserMsg()
    },
    // 添加用户
    async handleAdd () {
      const {
        data: { meta }
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
        data: { meta }
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
            data: { meta }
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
    },
    // 分配用户角色
    async handleRole (id) {
      this.dialogFormVisibleRole = true
      // 需要得到role_id
      const res = await this.$http.get(`users/${id}`)
      const {
        data: { data }
      } = res
      this.role = data
      this.currUserRId = this.role.rid
      // 获取角色列表
      const res1 = await this.$http.get(`roles`)
      this.roleList = res1.data.data
    },
    // 分配用户角色
    async handleEditRole () {
      const res = await this.$http.put(`users/${this.role.id}/role`, {
        rid: this.currUserRId
      })
      this.dialogFormVisibleRole = false
      const {
        data: { meta }
      } = res
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
.el-button--danger.is-plain:focus {
  background-color: #fef0f0;
}
#name,
#role {
  text-align: left;
}
</style>
