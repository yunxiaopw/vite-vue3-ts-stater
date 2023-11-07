<template>
  <div>
    <div>登录页面</div>
    {{ user.name }}
    <el-button type="primary">按钮</el-button>
    <router-link to="/home"> 跳转home </router-link>;
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import type { User } from '@/types/user';

const user: User = reactive({
  name: 'zhangsan',
  age: 20,
});
</script>

<style lang="less"></style>
