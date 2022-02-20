<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 警告条区域 -->
            <el-alert title="注意：只允许为第三级分类设置参数！" type="warning" show-icon :closable="false">
            </el-alert>
            <!-- 选择商品分类区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>
                        选择商品分类：
                    </span>
                    <!-- 级联选择器区域 -->
                    <el-cascader
                        clearable
                        v-model="selectedCateKeys"
                        :options="cateList"
                        :props="cateProps"
                        @change="handleChange">
                    </el-cascader>
                    <!-- tabs区域 -->
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <!-- 添加动态参数的面板 -->
                        <el-tab-pane label="动态参数" name="many">
                          <!-- 添加按钮区域 -->
                          <el-button type="primary" :disabled="isBtnDisabled" @click="showDialog">
                            添加参数
                          </el-button>
                          <!-- 表格区域 -->
                          <el-table
                            :data="manyTableData"
                            style="width: 100%"
                          >
                            <el-table-column type="expand">
                              <template slot-scope="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="item" closable @close="handleClose(index,scope.row)" :disable-transitions="false">{{item}}</el-tag>
                                <el-input
                                  class="input-new-tag"
                                  v-if="scope.row.inputVisible"
                                  v-model="scope.row.inputValue"
                                  ref="saveTagInput"
                                  size="small"
                                  @keyup.enter.native="handleInputConfirm(scope.row)"
                                  @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                <!-- <el-tag
                                  :key="tag"
                                  v-for="(tag,index) in dynamicTags"
                                  closable
                                  :disable-transitions="false"
                                  @close="handleClosedemo(index)">
                                  {{tag}}
                                </el-tag>
                                <el-input
                                  class="input-new-tag"
                                  v-if="inputVisible"
                                  v-model="inputValue"
                                  ref="saveTagInput"
                                  size="small"
                                  @keyup.enter.native="handleInputConfirmdemo"
                                  @blur="handleInputConfirmdemo"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInputdemo">+ New Tag</el-button> -->
                              </template>
                            </el-table-column>
                            <el-table-column type="index">
                            </el-table-column>
                            <el-table-column prop="attr_name" label="参数名称">
                            </el-table-column>
                            <el-table-column
                              label="操作">
                              <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" @click="editParams(scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-tab-pane>
                        <!-- 添加静态属性的面板 -->
                        <el-tab-pane label="静态属性" name="only">
                          <!-- 添加按钮区域 -->
                          <el-button type="primary" :disabled="isBtnDisabled" @click="showDialog">
                            添加属性
                          </el-button>
                          <!-- 表格区域 -->
                          <el-table
                            :data="onlyTableData"
                            style="width: 100%"
                          >
                            <el-table-column type="expand">
                              <template slot-scope="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                                <el-input
                                  class="input-new-tag"
                                  v-if="scope.row.inputVisible"
                                  v-model="scope.row.inputValue"
                                  ref="saveTagInput"
                                  size="small"
                                  @keyup.enter.native="handleInputConfirm(scope.row)"
                                  @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                              </template>
                            </el-table-column>
                            <el-table-column type="index">
                            </el-table-column>
                            <el-table-column prop="attr_name" label="参数名称">
                            </el-table-column>
                            <el-table-column
                              label="操作">
                              <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" @click="editParams">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-row>
        </el-card>
        <!-- 添加参数对话框区域 -->
        <el-dialog
          @close="dialogClosed"
          :title="titleText"
          :visible.sync="dialogVisible"
          width="50%">
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <el-form-item :label="inputLabel" prop="attr_name">
              <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 编辑参数对话框区域 -->
        <el-dialog
        close="editDialogClose"
          title="编辑参数"
          :visible.sync="editDialogVisible"
          width="50%">
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
            <el-form-item label="参数名称" prop="attr_name">
              <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParamsSure">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // demo +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // dynamicTags: ['标签一', '标签二', '标签三'],
      // inputVisible: false,
      // inputValue: '',
      // demo +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      cateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      dialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        attr_name: '',
        attr_sel: '',
        attr_id: '',
        cat_id: ''
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // demo----------------------------------------------------------------------
    // handleClosedemo (index) {
    //   this.dynamicTags.splice(index, 1)
    // },
    // showInputdemo () {
    //   console.log('ok')
    //   this.inputVisible = true
    //   console.log('ok1')
    //   this.$nextTick(_ => {
    //     this.$refs.saveTagInput.$refs.input.focus()
    //   })
    // },
    // handleInputConfirmdemo () {
    //   const inputValue = this.inputValue
    //   if (inputValue) {
    //     this.dynamicTags.push(inputValue)
    //   }
    //   this.inputVisible = false
    //   this.inputValue = ''
    // },
    // demo--------------------------------------------------------------------------
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      }
      this.cateList = res.data
      console.log(this.cateList, 66666)
    },
    async handleChange () {
      this.getParamsData()
    },
    handleClick () {
      console.log(this.activeName)
      this.getParamsData()
    },
    async getParamsData () {
      console.log(this.selectedCateKeys)
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.onlyTableData = []
        this.manyTableData = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败!')
      }
      res.data.forEach(function (item) {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
      console.log(res.data)
    },
    showDialog () {
      this.dialogVisible = true
    },
    dialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    addParams () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return 0
        }
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,
          { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败!')
        }
        this.$message.success('添加成功!')
        this.getParamsData()
        this.dialogVisible = false
      })
    },
    editParams (data) {
      this.editForm.attr_name = data.attr_name
      this.editForm.attr_sel = data.attr_sel
      this.editForm.attr_id = data.attr_id
      this.editForm.cat_id = data.cat_id
      this.editDialogVisible = true
      console.log(data)
    },
    editParamsSure () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.editForm.cat_id}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.editForm.attr_sel })
        if (res.meta.status !== 200) {
          this.$message.error('修改失败!')
          this.getCateList()
          return
        }
        this.getParamsData()
        this.$message.success('修改成功!')
        this.editDialogVisible = false
      })
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    deleteParams (data) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${data.cat_id}/attributes/${data.attr_id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败!')
        }
        this.getParamsData()
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
      console.log(data)
    },
    // input
    async handleClose (index, data) {
      console.log(index, data.attr_vals)
      data.attr_vals.splice(index, 1)
      const { data: res } = await this.$http.put(`categories/${data.cat_id}/attributes/${data.attr_id}`,
        { attr_name: data.attr_name, attr_sel: data.attr_sel, attr_vals: data.attr_vals.join(' ') })
      if (res.meta.status !== 200) {
        this.$message.error('删除失败!')
        return
      }
      this.$message.success('删除成功!')
    },
    showInput (data) {
      data.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleInputConfirm (data) {
      data.inputVisible = false
      if (data.inputValue === '') return
      data.attr_vals.push(data.inputValue.trim())
      data.inputValue = ''
      const { data: res } = await this.$http.put(`categories/${data.cat_id}/attributes/${data.attr_id}`,
        { attr_name: data.attr_name, attr_sel: data.attr_sel, attr_vals: data.attr_vals.join(' ') })
      if (res.meta.status !== 200) {
        this.$message.error('添加失败!')
        return
      }
      this.$message.success('添加成功!')
    }
  },
  computed: {
    isBtnDisabled () {
      if (this.selectedCateKeys.length === 3) {
        return false
      } else {
        return true
      }
    },
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') return '添加动态参数'
      else return '添加静态参数'
    },
    inputLabel () {
      if (this.activeName === 'many') return '动态参数'
      else return '静态参数'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt{
    margin: 15px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
