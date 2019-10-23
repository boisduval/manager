<template>
  <el-card class="card">
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <el-button type="primary" plain class="add">添加角色</el-button>
    <el-table :data="rolesData" stripe style="width: 100%" height="450px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 展开行内容 -->
          <span v-if="scope.row.children.length == 0">暂无权限</span>
          <el-row v-for="(item1, i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag
                class="level"
                closable
                :disable-transitions="false"
                @close="delRole(scope.row, item1.id)"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2, i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    class="level"
                    type="success"
                    closable
                    :disable-transitions="false"
                    @close="delRole(scope.row, item2.id)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <span v-for="(item3, i) in item2.children" :key="i">
                    <el-tag
                      class="level"
                      type="warning"
                      closable
                      :disable-transitions="false"
                      @close="delRole(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
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
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button type="primary" icon="el-icon-edit" circle plain size="mini"></el-button>
          <!-- 删除 -->
          <el-button type="danger" icon="el-icon-delete" circle plain size="mini" ref="del"></el-button>
          <!-- 角色授权 -->
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            plain
            size="mini"
            @click="getRights(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色授权框 -->
    <el-dialog title="角色授权" :visible.sync="dialogFormVisibleRights">
      <el-tree
        :data="rightsData"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedArr"
        :props="defaultProps"
        default-expand-all
        ref="rightsTree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRights = false">取 消</el-button>
        <el-button type="primary" @click="editRights">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rolesData: [],
      dialogFormVisibleRights: false,
      rightsData: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      checkedArr: [],
      currentRoleId: ""
    };
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const res = await this.$http.get(`roles`);
      const {
        data: { data }
      } = res;
      this.rolesData = data;
    },
    // 删除角色指定权限
    async delRole(role, rid) {
      // 角色id, 权限id
      const res = await this.$http.delete(`roles/${role.id}/rights/${rid}`);
      const {
        data: { data, meta }
      } = res;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        role.children = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 获取权限列表
    async getRights(role) {
      let rights = role.children;
      this.currentRoleId = role.id;
      this.checkedArr = [];
      this.dialogFormVisibleRights = true;
      const res = await this.$http.get(`rights/tree`);
      const {
        data: { data }
      } = res;
      this.rightsData = data;
      // 获取已选节点
      rights.forEach(element => {
        element.children.forEach(element1 => {
          element1.children.forEach(element2 => {
            this.checkedArr.push(element2.id);
          });
        });
      });
    },
    // 角色授权
    async editRights() {
      this.dialogFormVisibleRights = false;
      // 获取全选节点
      let arr1 = this.$refs.rightsTree.getCheckedKeys();
      // 获取半选节点
      let arr2 = this.$refs.rightsTree.getHalfCheckedKeys();
      let req = [...arr1, ...arr2];
      req = "" + req;
      const res = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: req
      });
      const {
        data: { meta }
      } = res;
      if (meta.status === 200) {
        this.$message.success(meta.msg);
        this.getRolesList();
      } else {
        this.$message.error(meta.msg);
      }
    }
  },
  created: function() {
    this.getRolesList();
  }
};
</script>

<style scoped>
.card {
  height: 100%;
  text-align: left;
}
.add {
  margin-top: 20px;
}
.level {
  margin-top: 10px;
  margin-left: 5px;
}
</style>
