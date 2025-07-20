<template>
  <HeaderBar />
  <el-container class="layout-container">
    <Menus />
    <paint />
    <ComponentAttr />
  </el-container>
</template>

<script lang="ts" setup>
import HeaderBar from '@/components/HeaderBar/HeaderBar.vue'
import Menus from './Menus.vue'
import Paint from './Paint.vue'
import ComponentAttr from './ComponentAttribute.vue'

</script>

<style lang="scss" scoped>
.layout-container {
  height: calc(100vh - 70px);
  overflow: hidden;
}
</style>
