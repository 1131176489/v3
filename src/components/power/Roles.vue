<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 添加角色按钮 -->
        <el-card class="box-card">
            <el-button type="primary">添加角色</el-button>
            <!-- 表格区域 -->
            <el-table
                :data="rightsList"
                border
                stripe
                style="width: 100%">
                <el-table-column>
                </el-table-column>
                <el-table-column
                type="index">
                </el-table-column>
                <el-table-column
                prop="authName"
                label="权限名称">
                </el-table-column>
                <el-table-column
                prop="path"
                label="角色描述">
                </el-table-column>
                <el-table-column
                prop="level"
                label="操作">
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>

</style>
