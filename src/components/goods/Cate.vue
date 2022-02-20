<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 添加分类按钮 -->
            <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
            <!-- 菜单组件 -->
            <!-- <treeMenus :list="treeMenusData"></treeMenus> -->
            <!-- 表格区域 -->
            <tree-table
            class="treeTable"
            :data="cateList"
            :columns="columns"
            :selection-type="false"
            :expand-type="false"
            :show-index="true"
            index-text="#"
            :border="true"
            :show-row-hover="true"
            >
            <template slot="isok" slot-scope="scope">
              <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: lightgreen"></i>
              <i class="el-icon-error" v-else style="color: red"></i>
            </template>
            <template slot="order" slot-scope="scope">
              <el-tag type="" size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
              <el-tag type="success" size="mini" v-if="scope.row.cat_level===1">二级</el-tag>
              <el-tag type="warning" size="mini" v-if="scope.row.cat_level===2">三级</el-tag>
            </template>
            <template slot="opt" slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete">删除</el-button>
              <el-tag type="warning" size="mini" v-if="scope.row.cat_level===2">三级</el-tag>
            </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[3,5,10,15]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
            <!-- 添加分类对话框 -->
            <el-dialog
              @closed="cateDialogClosed"
              title="添加分类"
              :visible.sync="addCateDialogVisible"
              width="50%"
              >
              <el-form
              :model="addCateForm"
              :rules="addCateRules"
              ref="addCateFormRef"
              label-width="100px"
              class="demo-ruleForm"
              >
                <el-form-item label="分类名称" prop="cat_name">
                  <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                  <el-cascader
                    class="cascader"
                    v-model="selectedKeys"
                    :options="parentCateList"
                    clearable
                    :props="cascaderProps"
                    @change="parentCateChange"
                  >
                  </el-cascader>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
              </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // treeMenusData: [ // 数据格式
      //   {
      //     name: '菜单1',
      //     children: [
      //       {
      //         name: '菜单1-1',
      //         children: [
      //           {
      //             name: '菜单1-1-1',
      //             children: []
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ],
      // 查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //  分类数据
      cateList: [],
      total: 0,
      addCateDialogVisible: false,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        type: 'template',
        template: 'isok'
      }, {
        label: '排序',
        type: 'template',
        template: 'order'
      }, {
        label: '操作',
        type: 'template',
        template: 'opt'
      }],
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      }
      console.log(res)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败!')
      }
      this.parentCateList = res.data
      console.log(res.data)
    },
    parentCateChange () {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        console.log(111)
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
        console.log(222)
      }
    },
    addCate () {
      console.log(this.addCateForm)
      console.log(this.selectedKeys)
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败!')
        }
        this.getCateList()
        this.$message.success('添加分类成功!')
        this.addCateDialogVisible = false
      })
      // this.selectedKeys = []
    },
    cateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable{
  margin-top: 15px;
  margin-bottom: 15px;
}
.cascader{
  width: 100%;
}
</style>
