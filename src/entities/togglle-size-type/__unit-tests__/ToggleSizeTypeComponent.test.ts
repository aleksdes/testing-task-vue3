import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
// @vitest-environment happy-dom
import { computed, defineComponent, h, ref } from 'vue'

const mockedCurrentTypeSize = ref<'decimal' | 'binary'>('decimal')

vi.mock('@/entities/togglle-size-type/model', async () => {
  const actual = await vi.importActual<typeof import('@/entities/togglle-size-type/model')>(
    '@/entities/togglle-size-type/model',
  )

  return {
    ...actual,
    useToggleSizeType: () => ({
      currentTypeSize: computed({
        get: () => mockedCurrentTypeSize.value,
        set: (value: 'decimal' | 'binary') => {
          mockedCurrentTypeSize.value = value
        },
      }),
    }),
  }
})

vi.mock('primevue/selectbutton', () => {
  return {
    default: defineComponent({
      name: 'SelectButtonStub',
      props: {
        modelValue: { type: String, required: false },
        options: { type: Array, required: true },
        optionLabel: { type: String, required: true },
        optionValue: { type: String, required: true },
        allowEmpty: { type: Boolean, required: false },
      },
      emits: ['update:modelValue'],
      setup(props, { emit }) {
        return () => h(
          'div',
          { 'data-testid': 'select-button' },
          (props.options as Array<Record<string, unknown>>).map((opt) => {
            const label = String(opt[props.optionLabel])
            const value = String(opt[props.optionValue])
            return h(
              'button',
              {
                'key': value,
                'type': 'button',
                'data-value': value,
                'aria-pressed': String(props.modelValue === value),
                'onClick': () => emit('update:modelValue', value),
              },
              label,
            )
          }),
        )
      },
    }),
  }
})

describe('entities/togglle-size-type/ui/ToggleSizeType', () => {
  it('renders 2 size type options', async () => {
    const { default: ToggleSizeType } = await import('@/entities/togglle-size-type/ui/ToggleSizeType.vue')
    render(ToggleSizeType)

    expect(screen.getByRole('button', { name: 'Двоичный' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Десятичный' })).toBeTruthy()
  })

  it('updates model when option clicked', async () => {
    mockedCurrentTypeSize.value = 'decimal'

    const { default: ToggleSizeType } = await import('@/entities/togglle-size-type/ui/ToggleSizeType.vue')
    render(ToggleSizeType)

    await fireEvent.click(screen.getByRole('button', { name: 'Двоичный' }))
    expect(mockedCurrentTypeSize.value).toBe('binary')

    await fireEvent.click(screen.getByRole('button', { name: 'Десятичный' }))
    expect(mockedCurrentTypeSize.value).toBe('decimal')
  })
})
