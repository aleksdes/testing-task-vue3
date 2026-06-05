<script setup lang="ts">
import { AuthScaffold } from '@/shared/ui/auth-scaffold'

defineOptions({
  name: 'BaseAuthScaffold',
})
</script>

<template>
  <AuthScaffold>
    <router-view />
  </AuthScaffold>
</template>

<style lang="scss" scoped>
</style>
