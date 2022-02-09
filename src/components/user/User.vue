<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容"
                    :clearable="true"
                    @clear="getUserList"
                     v-model="queryInfor.query">
                        <el-button slot="append" icon="el-icon-search"
                        @click="getUserList"
                        >
                        </el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table
            :data="userList"
            style="width: 100%"
            :border="true"
            :stripe="true">
            <el-table-column
                type="index">
            </el-table-column>
            <el-table-column
                prop="username"
                label="姓名">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="电话">
            </el-table-column>
            <el-table-column
                prop="role_name"
                label="角色">
            </el-table-column>
            <el-table-column
                label="状态">
            <template slot-scope="scope">
              <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)">
              </el-switch>
            </template>
            </el-table-column>
            <el-table-column
                label="操作"
                width="180px">
            <template slot-scope="scope">
              <!-- slot-scope="scope" -->
                <el-row>
                  <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
                  </el-tooltip>

                  <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row)"></el-button>
                  </el-tooltip>

                  <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                    <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                  </el-tooltip>
                </el-row>
            </template>
            </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfor.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="queryInfor.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
            <!-- 添加用户对话框 -->
            <el-dialog
              title="添加用户"
              :visible.sync="dialogVisible"
              width="30%"
              @close="addDialogClosed"
              >
              <!-- 对话框内表单区域 -->
            <el-form
            :model="addForm"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="100px"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
            </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 修改用户对话框 -->
            <el-dialog
              title="修改用户"
              :visible.sync="editDialogVisible"
              width="50%"
              @close="editDialogClosed"
              >
              <el-form :model="editForm"
              :rules="editFormRules"
              ref="editFormRef"
              label-width="70px">
                <el-form-item label="用户名">
                  <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editForm.email"></el-input>
                </el-form-item>

                <el-form-item label="手机号码" prop="mobile">
                  <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
              </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (!regEmail.test(value)) {
        return callback(new Error('请输入合法的邮箱!'))
      }
      return callback()
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (!regMobile.test(value)) {
        return callback(new Error('请输入合法的手机号!'))
      }
      return callback()
    }
    return {
      queryInfor: {
        query: '',
        // 当前页
        pagenum: 1,
        pagesize: 10
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible: false,
      editForm: {},
      // 表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfor })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange (newSize) {
      this.queryInfor.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      this.queryInfor.pagenum = newPage
      this.getUserList()
    },
    async userStateChange (userInfo) {
      console.log(userInfo)
      const { data: res } = await this.$http.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败！')
        this.$message.success(
          '添加用户成功'
        )
        this.dialogVisible = false
        this.getUserList()
      })
    },
    async showEditDialog (data) {
      this.editDialogVisible = true
      console.log(data.id)
      const { data: res } = await this.$http.get(`users/${data.id}`)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败！')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          this.$message.error('修改失败!')
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改成功!')
      })
    },
    removeUserById (data) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        left: true
      }).then(async () => {
        const { data: res } = await this.$http.delete(`users/${data.id}`)
        if (res.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getUserList()
      }).catch(() => {
        console.log('1全方位热情而')
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-table-column{
    width: 150px;
}
.el-table{
    margin-top: 10px;
    font-size: 12px;
}
</style>
