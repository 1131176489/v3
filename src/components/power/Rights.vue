<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
            <!-- 表格区域 -->
            <el-table
                :data="rightsList"
                border
                stripe
                style="width: 100%">
                <el-table-column
                type="index">
                </el-table-column>
                <el-table-column
                prop="authName"
                label="权限名称">
                </el-table-column>
                <el-table-column
                prop="path"
                label="路径">
                </el-table-column>
                <el-table-column
                prop="level"
                label="权限等级">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                    <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
                    <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
                </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败!')
      }
      console.log(res.data)
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="less" scoped>

</style>
