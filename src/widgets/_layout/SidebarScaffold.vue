<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import Button from 'primevue/button'
import { onMounted, ref } from 'vue'
import { Scaffold } from '@/shared/ui'
import { LogotypeGray } from '@/shared/ui/theme/icons'

import {
  SideNavigationBar,
  SideNavigationBarItem,
  SideNavigationBarItemMobile,
  SideNavigationBarMobile,
} from '../sidebar'
import { menuItems } from '../sidebar/model'

const railSidebar = ref(false)
const { width } = useWindowSize()
// Функции управления меню
function toggleMenu() {
  railSidebar.value = !railSidebar.value
}

onMounted(() => {
  // Инициализация ширины
  if (width.value >= 768) {
    railSidebar.value = true
  }
})
</script>

<template>
  <Scaffold>
    <template #side>
      <SideNavigationBar
        v-if="width >= 768"
        :rail="railSidebar"
      >
        <template #leading>
          <div
            class="flex w-full items-center"
            :class="[{ 'justify-center': !railSidebar }]"
          >
            <LogotypeGray class="logotype" />
          </div>
        </template>

        <SideNavigationBarItem
          v-for="(item, index) in menuItems"
          :key="index"
          :mini="!railSidebar"
          :data-route="item"
        />

        <template #bottom>
          <Button
            :icon="`pi pi-angle-double-${railSidebar ? 'left' : 'right'}`"
            class="button-rail" :class="[{ 'button-rail--mini': !railSidebar }]"
            severity="contrast"
            variant="text"
            :aria-label="railSidebar ? 'Свернуть сайдбар' : 'Развернуть сайдбар'"
            :title="railSidebar ? 'Свернуть' : 'Развернуть'"
            :label="railSidebar ? 'Свернуть' : ''"
            @click="toggleMenu"
          />
        </template>
      </SideNavigationBar>

      <SideNavigationBarMobile
        v-else
      >
        <SideNavigationBarItemMobile
          v-for="(item, index) in menuItems"
          :key="index"
          :data-route="item"
        />
      </SideNavigationBarMobile>
    </template>

    <router-view />
  </Scaffold>
</template>

<style scoped lang="scss">
.logotype {
  height: pxToRem(40px);
  width: auto;
  margin-bottom: 1.5rem;
}

.button-rail {
  width: 100% !important;

  &--mini {
    width: pxToRem(40px) !important;
    height: pxToRem(40px) !important;
  }
}
</style>
