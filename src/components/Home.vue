<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/favicon.jpg" alt="" srcset="" />
        <span>主页</span>
      </div>
      <el-button type="info" v-on:click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '220px'">
          <!-- 侧边菜单栏 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          style="padding-left:0 !important;width: 100% !important;"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="false"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active='activePath'
        >
        <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menulist" v-bind:key="item.id">
              <!-- 一级菜单的模板区域 -->
            <template slot="title">
                <!-- 图标 -->
              <i :class="iconobj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children"
            :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
    //   左侧菜单数据
      menulist: [],
      iconobj: {
        125: 'icon-users',
        103: 'icon-box',
        101: 'icon-gift',
        102: 'icon-file-text',
        145: 'icon-stats-bars'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang='less' scoped>
// @color: pink;
.home-container {
  height: 100%;
}
.el-header {
  background-color: rgb(55, 60, 64);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
      border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
i[class^=icon]{
    margin-right: 10px;
}
.toggle-button{
    width: 100%;
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
