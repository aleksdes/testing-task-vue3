import type { Store } from 'pinia'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type CurrentTypeSizeType = 'decimal' | 'binary'
export enum ECurrentTypeSizeValues {
  Decimal = 'decimal',
  Binary = 'binary',
}

/**
 * Описание структуры данных
 */
export declare interface IToggleSizeTypeState {
  currentTypeSize: Ref<CurrentTypeSizeType>
}

export declare interface ToggleSizeTypeStore extends Store<'toggle-type-size', IToggleSizeTypeState> {}

export const useToggleSizeTypeState: () => ToggleSizeTypeStore = defineStore('toggle-type-size', () => {
  const currentTypeSize = ref<CurrentTypeSizeType>('decimal')

  return {
    currentTypeSize,
  }
}, {
  persist: true,
})
