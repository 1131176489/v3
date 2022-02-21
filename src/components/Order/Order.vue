<template>
    <div>
        <!-- 买保险 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 输入框区域 -->
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 表格区域 -->
            <el-table
                :data="orderlist"
                stripe
                border>
                <el-table-column type="index">
                </el-table-column>
                <el-table-column
                prop="order_number"
                label="订单编号">
                </el-table-column>
                <el-table-column
                prop="order_price"
                label="订单价格">
                </el-table-column>
                <el-table-column
                prop="pay_status"
                label="是否付款">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
                        <el-tag type="warning" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                prop="is_send"
                label="是否发货">
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间">
                    <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column
                label="操作">
                    <template>
                        <el-button type="primary" icon="el-icon-edit" size="mini" v-on:click="editAddress"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini" v-on:click="location"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
            <!-- 对话框1 -->
            <el-dialog
            v-on:close="editDialogClose"
            title="请填写详细地址"
            :visible.sync="editAddressDialogVisible"
            width="50%">
                <el-form :model="editAddressForm" :rules="editAddressFormRules" ref="editAddressFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader
                    v-model="editAddressForm.address1"
                    :options="cityData"
                    :props="editProps"
                    @change="handleChange">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="editAddressForm.address2"></el-input>
                </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editAddressDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editAddressDialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>
            <!-- 对话框2 -->
            <el-dialog
            v-on:close="locationDialogClose"
            title="提示"
            :visible.sync="locationDialogVisible"
            width="60%">
            <el-timeline :reverse="reverse">
                <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.time">
                {{activity.context}}
                </el-timeline-item>
            </el-timeline>
            <span slot="footer" class="dialog-footer">
                <el-button @click="locationDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="locationDialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 10
      },
      input3: '',
      orderlist: [],
      total: 0,
      editAddressDialogVisible: false,
      editAddressForm: {
        address1: [],
        address2: ''
      },
      locationDialogVisible: false,
      cityData: cityData,
      editAddressFormRules: {
        address1: [
          { required: true, message: '请选择省市县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      editProps: {
        expandTrigger: 'hover'
      },
      activities: [],
      reverse: false
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.total = res.data.total
      this.orderlist = res.data.goods
      console.log(res.data)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    editAddress () {
      this.editAddressDialogVisible = true
    },
    location () {
      this.getkuaidi()
      this.locationDialogVisible = true
    },
    handleChange () {},
    editDialogClose () {
      this.$refs.editAddressFormRef.resetFields()
    },
    locationDialogClose () {},
    async getkuaidi () {
      const { data: res } = await this.$http.get(`/kuaidi/${1106975712662}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.activities = res.data
      console.log(res.data)
    }
  }
}
</script>

<style lang="less" scoped>
.el-table{
    margin: 15px 0;
}
.el-cascader{
    width: 100%;
}
</style>
