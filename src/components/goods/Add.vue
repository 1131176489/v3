<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                title="添加商品信息"
                type="info"
                :closable="false"
                center
                show-icon>
            </el-alert>
            <el-steps :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm" label-position="top">
                <!-- tab区域 -->
                <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeLeave" @tab-click="tabClick">
                    <el-tab-pane label="基本信息" name=0>
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addForm.goods_cat"
                                :options="goodsCate"
                                :props="addProps"
                                @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name=1>
                        <el-form-item :label="item.attr_name" v-for="(item) in manyTableData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                              <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name=2>
                        <el-form-item :label="item.attr_name" v-for="(item) in onlyTableData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name=3>
                        <el-upload
                          class="upload-demo"
                          :on-success="onSuccess"
                          action="https://lianghj.top:8888/api/private/v1/upload"
                          :headers="headers"
                          :on-preview="handlePreview"
                          :on-remove="handleRemove"
                          list-type="picture">
                          <el-button size="small" type="primary">点击上传</el-button>
                          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name=4>
                        <quill-editor
                          ref="myQuillEditor"
                          v-model="addForm.goods_introduce"/>
                        <el-button type="primary" class="btn" v-on:click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="30%">
          <img :src="previewPath" alt="" class="imgSize">
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activeIndex: 0,
      // 表单数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '这是一段描述',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      goodsCate: [],
      value: [],
      addProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewDialogVisible: false,
      previewPath: ''
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.goodsCate = res.data
      console.log(this.goodsCate)
    },
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return
      }
      console.log(this.addForm.goods_cat)
    },
    beforeLeave (activeName, oldActiveName) {
      if (this.addForm.goods_cat.length !== 3 && oldActiveName === '0') {
        this.$message.error('请选择商品分类!')
        return false
      }
      console.log(activeName, oldActiveName)
    },
    async tabClick () {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数列表失败!')
        }
        this.manyTableData = res.data
        this.manyTableData.forEach((item) => {
          item.attr_vals = (item.attr_vals === '' ? [] : item.attr_vals.split(' '))
        })
        console.log(this.manyTableData)
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数列表失败!')
        }
        this.onlyTableData = res.data
        console.log(this.onlyTableData)
      }
    },
    handlePreview (file) {
      this.previewDialogVisible = true
      this.previewPath = file.response.data.url
    },
    handleRemove (file) {
      console.log(file)
      const i = this.addForm.pics.findIndex((item) => item.pics === file.response.data.tmp_path)
      console.log(i)
      this.addForm.pics.splice(i, 1)
    },
    onSuccess (response) {
      console.log(response)
      const picInfo = { pics: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    addGoods () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请填写必填项!')
        var form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error('添加商品失败!')
        this.$message.success('添加商品成功!')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) return this.addForm.goods_cat[2]
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps{
    margin: 15px 0;
}
.el-checkbox{
  margin: 0 10px 0 0 !important;
}
.imgSize{
  width: 100%;
}
.btn{
  margin-top: 15px;
}
</style>
