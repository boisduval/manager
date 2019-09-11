<template>
  <el-card class="card">
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <el-button type="primary" plain class="add">添加角色</el-button>
    <el-table :data="rolesData" stripe style="width: 100%" height="450px">
      <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 展开行内容 -->
            <el-row v-for="(item1, i) in scope.row.children" :key="i">
              <el-col :span="4">{{item1.authName}}</el-col>
              <el-col :span="20">
                <el-row v-for="(item2, i) in item1.children" :key="i">
                  <el-col :span="4">{{item2.authName}}</el-col>
                  <el-col :span="20">
                    <span v-for="(item3, i) in item2.children" :key="i">
                      {{item3.authName}}
                    </span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template>
          <!-- 编辑 -->
          <el-button type="primary" icon="el-icon-edit" circle plain size="mini"></el-button>
          <!-- 删除 -->
          <el-button type="danger" icon="el-icon-delete" circle plain size="mini" ref="del"></el-button>
          <!-- 分配用户角色 -->
          <el-button type="success" icon="el-icon-check" circle plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      rolesData: []
    }
  },
  methods: {
    async getRolesList () {
      const res = await this.$http.get(`roles`)
      console.log(res)
      const {
        data: { data }
      } = res
      this.rolesData = data
    }
  },
  created: function () {
    this.getRolesList()
  }
}
</script>

<style scoped>
.card {
  height: 100%;
  text-align: left;
}
.add {
  margin-top: 20px;
}
</style>
