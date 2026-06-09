<!--
  图标组件 - 基于 Iconify
  用法:
    <Icon name="mdi:arrow-left" :size="16" color="#333" />
    <Icon name="mdi:arrow-right" :size="18" />
-->
<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  // 图标名称，格式为 "集合:图标名"，如 "mdi:arrow-left"
  name: string
  // 图标大小
  size?: string | number
  // 图标颜色
  color?: string
}>()
</script>

<template>
  <Icon :icon="name" :width="size" :height="size" :color="color" />
</template>