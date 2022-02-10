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
            <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
            <!-- 表格区域 -->
            <el-table
                :data="rolelist"
                border
                stripe
                style="width: 100%">
                <!-- 展开列 -->
                <el-table-column type="expand"></el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                    <!-- slot-scope="scope" -->
                        <el-row>
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                            <el-button type="warning" icon="el-icon-setting" size="mini">分配</el-button>
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
            <el-button type="primary" @click="editRole()">确 定</el-button>
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
    editRole (id) {
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
      console.log(id)
    }
  }
}
</script>

<style lang="less" scoped>
.el-table{
    margin-top: 20px;
}
</style>
