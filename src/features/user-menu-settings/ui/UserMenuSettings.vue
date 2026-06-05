<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import { computed, ref } from 'vue'
import { useCurrentUser } from '@/entities/session'

const visible = ref(false)
const { currentUser, fullName, userInitials } = useCurrentUser()
const { width: widthWindow } = useWindowSize()

// Вычисляем отображаемое имя пользователя
const displayName = computed(() => {
  if (fullName.value) {
    return fullName.value
  }
  return 'Пользователь'
})

// Логин пользователя
const userDesc = computed(() => currentUser.value?.fullName || currentUser.value?.login || '')
</script>

<template>
  <div class="card flex justify-center">
    <Drawer v-model:visible="visible" position="right">
      <template #header>
        <div class="flex items-center gap-3">
          <Avatar
            :label="currentUser?.avatar ? '' : userInitials"
            :image="currentUser?.avatar"
            class="user-avatar shrink-0"
            style="background-color: rgba(0, 0, 0, 0.2); color: black"
            shape="circle"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium  truncate">
              {{ displayName }}
            </p>
            <p v-if="userDesc" class="text-xs  truncate">
              {{ userDesc }}
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex items-center gap-2">
          <Button
            label="Выйти"
            icon="pi pi-sign-out"
            class="w-100"
          />
        </div>
      </template>
    </Drawer>

    <div
      class="flex items-center gap-3 cursor-pointer"
      @click="visible = true"
    >
      <Avatar
        :label="currentUser?.avatar ? '' : userInitials"
        :image="currentUser?.avatar"
        class="user-avatar shrink-0"
        style="background-color: rgba(0, 0, 0, 0.2); color: black"
        shape="circle"
      />
      <div v-if="widthWindow >= 1024" class="flex-1 min-w-0">
        <p class="user-avatar__title font-medium truncate">
          {{ displayName }}
        </p>
        <p v-if="userDesc" class="user-avatar__desc truncate">
          {{ userDesc }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-avatar {
  width: pxToRem(42px);
  height: pxToRem(42px);

  &__title {
    font-size: pxToRem(16px);
    line-height: 1;
  }
  &__desc {
    font-size: pxToRem(14px);
    color: var(--color-surface-500);
  }
}
</style>
