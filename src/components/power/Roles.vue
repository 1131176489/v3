<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!-- 添加角色按钮 -->
            <el-row>
              <el-col>
                <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
              </el-col>
            </el-row>
            <!-- 表格区域 -->
            <el-table
                :data="rolelist"
                border
                stripe
                style="width: 100%">
                <!-- 展开列 -->
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bdbottom',i1===0 ? 'bdtop' : '','vcenter']">
                      <!-- 渲染一级权限 -->
                      <el-col :span="5">
                        <el-tag>{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- 渲染二级和三级权限 -->
                      <el-col :span="19">
                        <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2===0 ? '' : 'bdtop','vcenter']">
                          <!-- 二级权限 -->
                          <el-col :span="6">
                            <el-tag type="success">{{item2.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                          </el-col>
                          <!-- 三级权限 -->
                          <el-col :span="18" >
                            <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                    <pre>
                      {{scope.row}}
                    </pre>
                  </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-row>
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRole(scope.row.id)">删除</el-button>
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog
        title="添加用户"
        :visible.sync="addRoleDialogVisible"
        width="30%"
        @closed="addRoleDialogClosed"
        >
            <!-- 表单区域 -->
            <el-form :model="addRoleRuleForm" :rules="addRoleRules" ref="addRoleRuleFormRef" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addRoleRuleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addRoleRuleForm.roleDesc"></el-input>
            </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 编辑用户对话框 -->
        <el-dialog
        title="编辑用户"
        :visible.sync="editDialogVisible"
        width="30%"
        @closed="editRoleDialogClosed"
        >
            <!-- 表单区域 -->
            <el-form :model="editRoleRuleForm" :rules="editRoleRules" ref="editRoleRuleFormRef" label-width="100px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="editRoleRuleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="editRoleRuleForm.roleDesc"></el-input>
            </el-form-item>
            </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 分配权限对话框 -->
        <el-dialog
          title="分配权限"
          :visible.sync="setRightDialogVisible"
          @closed="setRightDialogClosed"
          width="50%">
          <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          :default-checked-keys="defKeys"
          :default-expand-all="true"
          ref="treeRef"
          ></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 数据数组
      rolelist: [],
      addRoleDialogVisible: false,
      editDialogVisible: false,
      setRightDialogVisible: false,
      rightsList: [],
      defKeys: [],
      roleId: '',
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      addRoleRuleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleRuleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleRules: {
        roleName: { required: true, message: '请输入角色名称', trigger: 'blur' }
      },
      editRoleRules: {
        roleName: { required: true, message: '请输入角色名称', trigger: 'blur' }
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.rolelist = res.data
    },
    async addRole () {
      this.$refs.addRoleRuleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRoleRuleForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败!')
        }
        this.$message.success('添加角色成功!')
        this.getRolesList()
        this.addRoleDialogVisible = false
      })
    },
    addRoleDialogClosed () {
      this.$refs.addRoleRuleFormRef.resetFields()
    },
    editRoleDialogClosed () {
      this.$refs.editRoleRuleFormRef.resetFields()
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询角色失败!')
      }
      this.editRoleRuleForm = res.data
      this.editDialogVisible = true
    },
    editRole () {
      this.$refs.editRoleRuleFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(`roles/${this.editRoleRuleForm.roleId}`, this.editRoleRuleForm)
        if (res.meta.status !== 200) {
          return this.$message.error('编辑角色失败!')
        }
        this.$message.success('编辑角色成功!')
        this.getRolesList()
        this.editDialogVisible = false
      })
    },
    removeRole (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${id}`)
        if (res.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          return
        }
        this.getRolesList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async removeRightById (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败!')
      }
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      role.children = res.data
      console.log('ok')
    },
    async showSetRightDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败!')
      }
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        arr.push(node.id)
        return
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClosed () {
      this.defKeys = []
    },
    async allotRights () {
      const arr = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = arr.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败!')
      }
      this.$message.success('分配权限成功!')
      this.getRolesList()
      this.setRightDialogVisible = false
      console.log(arr)
    }
  }
}
</script>

<style lang="less" scoped>
.el-table{
    margin-top: 20px;
}
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
