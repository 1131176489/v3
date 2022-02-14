<template>
  <ul>
    <li v-for="(item,index) in list " :key="index">
      <p>{{item.name}}</p>
      <treeMenus :list="item.children"></treeMenus>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'treeMenus',
  props: {
    list: Array
  }
}
</script>

<style>
ul {
    padding-left: 20px !important;
}
</style>
