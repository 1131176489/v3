<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 搜索框区域 -->
            <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getGoodsList">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
            <!-- 添加商品按钮区域 -->
            <el-button type="primary" style="margin-left: 15px" @click="addGoods">添加商品</el-button>
            <!-- 表格区域 -->
            <el-table :data="goodList" border stripe style="width: 100%">
                    <el-table-column type="index">
                    </el-table-column>
                    <el-table-column prop="goods_name" label="商品名称">
                    </el-table-column>
                    <el-table-column prop="goods_price" label="商品价格(元)">
                    </el-table-column>
                    <el-table-column prop="goods_weight" label="商品重量">
                    </el-table-column>
                    <el-table-column label="创建时间">
                        <template slot-scope="scope">
                            {{scope.row.add_time | dateFormat}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit"></el-button>
                            <el-button type="danger" icon="el-icon-delete" @click="open(scope.row)"></el-button>
                        </template>
                    </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodList: [],
      total: 100,
      currentPage: 1
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品列表数据失败!')
      }
      console.log(res)
      this.goodList = res.data.goods
      this.total = res.data.total
      console.log(this.total)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    search () {
      this.getGoodsList()
    },
    open (row) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
        if (res.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
          return
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getGoodsList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addGoods () {
      this.$router.push('/goods/add')
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.input-with-select{
    width: 250px;
}
.el-table{
    margin-top: 15px;
}
</style>
