<template>
  <el-card class="card">
    <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
    <el-table :data="rightsData" height="500" border style="width: 100%; margin-top: 20px" stripe>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  created: function () {
    this.getRightsList()
  },
  data () {
    return {
      rightsData: []
    }
  },
  methods: {
    async getRightsList () {
      const res = await this.$http.get(`rights/list`)
      const {
        data: { data }
      } = res
      this.rightsData = data
    }
  }
}
</script>

<style scoped>
.card {
  height: 100%;
}
</style>
