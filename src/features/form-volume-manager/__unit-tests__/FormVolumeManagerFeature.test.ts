// @vitest-environment happy-dom
import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

const checkNameMock = vi.fn()

vi.mock('@/shared/generated/mock.ts', () => ({
  mockApi: {
    checkName: (name: string) => checkNameMock(name),
  },
}))

const mockedCurrentTypeSize = ref<'decimal' | 'binary'>('decimal')
vi.mock('@/entities/togglle-size-type/model', async () => {
  const actual = await vi.importActual<typeof import('@/entities/togglle-size-type/model')>(
    '@/entities/togglle-size-type/model',
  )

  return {
    ...actual,
    useToggleSizeType: () => ({
      currentTypeSize: mockedCurrentTypeSize,
    }),
  }
})

vi.mock('primevue/button', () => ({
  default: defineComponent({
    name: 'ButtonStub',
    props: {
      disabled: { type: Boolean, required: false },
      type: { type: String, required: false },
    },
    setup(props, { slots }) {
      return () => h('button', { disabled: props.disabled, type: props.type }, slots.default?.())
    },
  }),
}))

vi.mock('primevue/floatlabel', () => ({
  default: defineComponent({
    name: 'FloatLabelStub',
    setup(_, { slots }) {
      return () => h('div', slots.default?.())
    },
  }),
}))

vi.mock('primevue/iconfield', () => ({
  default: defineComponent({
    name: 'IconFieldStub',
    setup(_, { slots }) {
      return () => h('div', slots.default?.())
    },
  }),
}))

vi.mock('primevue/inputgroup', () => ({
  default: defineComponent({
    name: 'InputGroupStub',
    setup(_, { slots }) {
      return () => h('div', slots.default?.())
    },
  }),
}))

vi.mock('primevue/inputgroupaddon', () => ({
  default: defineComponent({
    name: 'InputGroupAddonStub',
    setup(_, { slots }) {
      return () => h('span', { 'data-testid': 'size-addon' }, slots.default?.())
    },
  }),
}))

vi.mock('primevue/inputicon', () => ({
  default: defineComponent({
    name: 'InputIconStub',
    setup() {
      return () => null
    },
  }),
}))

vi.mock('primevue/inputtext', () => ({
  default: defineComponent({
    name: 'InputTextStub',
    inheritAttrs: false,
    props: {
      id: { type: String, required: false },
      modelValue: { type: [String, Number], required: false },
    },
    emits: ['update:modelValue'],
    setup(props, { attrs, emit }) {
      function forwardFieldUpdateModelValue(value: string) {
        const handler = attrs['onUpdate:modelValue']
        if (typeof handler === 'function')
          handler(value)
      }

      return () => h('input', {
        id: props.id,
        value: props.modelValue ?? '',
        onInput: (e: Event) => {
          const value = (e.target as HTMLInputElement).value
          emit('update:modelValue', value)
          forwardFieldUpdateModelValue(value)
        },
      })
    },
  }),
}))

vi.mock('primevue/selectbutton', () => ({
  default: defineComponent({
    name: 'SelectButtonStub',
    props: {
      modelValue: { type: String, required: false },
      options: { type: Array, required: true },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      return () => h(
        'div',
        (props.options as string[]).map(value => h(
          'button',
          {
            'key': value,
            'type': 'button',
            'aria-pressed': String(props.modelValue === value),
            'onClick': () => emit('update:modelValue', value),
          },
          value,
        )),
      )
    },
  }),
}))

vi.mock('vee-validate', () => {
  const Form = defineComponent({
    name: 'VeeFormStub',
    emits: ['submit'],
    setup(_, { slots, emit }) {
      return () => h(
        'form',
        {
          onSubmit: (e: Event) => {
            e.preventDefault()
            emit('submit')
          },
        },
        slots.default?.({ meta: { valid: true } }),
      )
    },
  })

  const Field = defineComponent({
    name: 'VeeFieldStub',
    props: {
      name: { type: String, required: false },
      modelValue: { type: [String, Number, null], required: false },
    },
    emits: ['update:modelValue'],
    setup(props, { slots, emit }) {
      return () => {
        const field = {
          'value': props.modelValue,
          'onUpdate:modelValue': (value: unknown) => emit('update:modelValue', value),
        }
        return h('div', slots.default?.({ errors: [], field }))
      }
    },
  })

  return { Form, Field }
})

async function flushPromises() {
  await Promise.resolve()
  await nextTick()
}

describe('features/form-volume-manager/ui/FormVolumeManagerFeature', () => {
  it('renders formatted size label (decimal -> binary)', async () => {
    mockedCurrentTypeSize.value = 'decimal'
    checkNameMock.mockResolvedValue({ unique: true })

    const { default: FormVolumeManagerFeature } = await import('@/features/form-volume-manager/ui/FormVolumeManagerFeature.vue')

    render(FormVolumeManagerFeature, {
      global: {
        directives: {
          // used in template: v-keyfilter / v-keyfilter.num
          keyfilter: () => {},
        },
      },
    })

    expect(screen.getByTestId('size-addon').textContent).toBe('0 B')

    await fireEvent.update(screen.getByLabelText('Размер'), '1024')
    await flushPromises()
    expect(screen.getByTestId('size-addon').textContent).toBe('1.02 KB')

    mockedCurrentTypeSize.value = 'binary'
    await flushPromises()
    expect(screen.getByTestId('size-addon').textContent).toBe('1 KiB')
  })

  it('shows unique-name error after debounce when name is not unique', async () => {
    vi.useFakeTimers()
    mockedCurrentTypeSize.value = 'decimal'
    checkNameMock.mockResolvedValueOnce({ unique: false })

    const { default: FormVolumeManagerFeature } = await import('@/features/form-volume-manager/ui/FormVolumeManagerFeature.vue')

    render(FormVolumeManagerFeature, {
      global: {
        directives: {
          keyfilter: () => {},
        },
      },
    })

    await fireEvent.update(screen.getByLabelText('Имя'), 'fast-storage')
    await vi.advanceTimersByTimeAsync(1000)
    await flushPromises()

    expect(screen.getByText('Указанное имя неуникально')).toBeTruthy()
    const submit = screen.getByRole('button', { name: 'Отправить данные' })
    expect((submit as HTMLButtonElement).disabled).toBe(true)

    vi.useRealTimers()
  })

  it('emits sendData on submit with current form state', async () => {
    vi.useFakeTimers()
    mockedCurrentTypeSize.value = 'decimal'
    checkNameMock.mockResolvedValue({ unique: true })

    const { default: FormVolumeManagerFeature } = await import('@/features/form-volume-manager/ui/FormVolumeManagerFeature.vue')

    const { emitted } = render(FormVolumeManagerFeature, {
      global: {
        directives: {
          keyfilter: () => {},
        },
      },
    })

    await fireEvent.update(screen.getByLabelText('Имя'), 'new-volume')
    await vi.advanceTimersByTimeAsync(1000)
    await flushPromises()

    await fireEvent.click(screen.getByRole('button', { name: 'file' }))
    await fireEvent.update(screen.getByLabelText('Размер'), '1000')
    await flushPromises()

    await fireEvent.click(screen.getByRole('button', { name: 'Отправить данные' }))

    const events = emitted() as any
    expect(events).toHaveProperty('sendData')
    expect(events.sendData?.[0]?.[0]).toEqual({
      name: 'new-volume',
      type: 'file',
      size: '1000',
    })

    vi.useRealTimers()
  })
})
