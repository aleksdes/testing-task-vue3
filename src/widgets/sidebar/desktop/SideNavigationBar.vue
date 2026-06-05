<script setup lang="ts">
import type {
  SideNavigationBarEmits,
  SideNavigationBarProps,
  SideNavigationBarSlots,
} from './side-navigation-bar'
import { toRefs } from 'vue'

defineOptions({
  name: 'SideNavigationBar',
})

const props = withDefaults(defineProps<SideNavigationBarProps>(), {
  rail: false,
})

defineEmits<SideNavigationBarEmits>()
defineSlots<SideNavigationBarSlots>()

const { rail } = toRefs(props)
</script>

<template>
  <aside
    id="sideNavigationBar"
    class="side-navigation-bar h-screen flex flex-col overflow-hidden shrink-0"
    :class="rail ? 'min-w-[230px]' : 'w-auto'"
  >
    <div class="side-navigation-bar__container">
      <div class="side-navigation-bar__leading">
        <slot name="leading" />
      </div>

      <div class="side-navigation-bar__menu">
        <slot />
      </div>

      <div class="side-navigation-bar__bottom">
        <slot name="bottom" />
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
/* Скрываем скроллбар для меню */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.side-navigation-bar {
  min-height: 100vh;
  max-height: 100vh;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 10;
  width: min-content;
  padding: pxToRem(10px);

  @include acceleratedTransition(('width'), 800);

  &__container {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--color-white);
    padding: pxToRem(16px);
    border-radius: var(--radius-3xl);
    box-shadow: 0 0 2px 0 rgba(18, 18, 23, 0.05);
  }

  &__leading {
    overflow: hidden;
  }

  &__menu {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
    gap: pxToRem(4px);
  }
}
</style>
