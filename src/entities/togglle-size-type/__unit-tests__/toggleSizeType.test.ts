import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { ECurrentTypeSizeValues, useToggleSizeType } from '@/entities/togglle-size-type'
import { useToggleSizeTypeState } from '@/entities/togglle-size-type/model/State.ts'

describe('entities/togglle-size-type', () => {
  it('state: defaults to decimal and can be changed', () => {
    setActivePinia(createPinia())

    const store = useToggleSizeTypeState()
    expect(store.currentTypeSize).toBe(ECurrentTypeSizeValues.Decimal)

    store.currentTypeSize = ECurrentTypeSizeValues.Binary
    expect(store.currentTypeSize).toBe(ECurrentTypeSizeValues.Binary)
  })

  it('useToggleSizeType: proxies store value via writable computed', () => {
    setActivePinia(createPinia())

    const store = useToggleSizeTypeState()
    const { currentTypeSize } = useToggleSizeType(store)

    expect(currentTypeSize.value).toBe(ECurrentTypeSizeValues.Decimal)

    currentTypeSize.value = ECurrentTypeSizeValues.Binary
    expect(store.currentTypeSize).toBe(ECurrentTypeSizeValues.Binary)

    store.currentTypeSize = ECurrentTypeSizeValues.Decimal
    expect(currentTypeSize.value).toBe(ECurrentTypeSizeValues.Decimal)
  })
})
