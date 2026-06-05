import type { WritableComputedRef } from 'vue'
import type { CurrentTypeSizeType, ToggleSizeTypeStore } from './State.ts'
import { computed } from 'vue'
import { useToggleSizeTypeState } from './State.ts'

export interface UseToggleSizeReturn {
  currentTypeSize: WritableComputedRef<CurrentTypeSizeType>
}

export function useToggleSizeType(
  store: ToggleSizeTypeStore = useToggleSizeTypeState(),
): UseToggleSizeReturn {
  const currentTypeSize = computed({
    get() {
      return store.currentTypeSize
    },
    set(value: CurrentTypeSizeType) {
      store.currentTypeSize = value
    },
  })

  return {
    currentTypeSize,
  }
}
