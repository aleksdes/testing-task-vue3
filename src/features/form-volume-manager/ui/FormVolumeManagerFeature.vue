<script setup lang="ts">
import type { IDataForm } from '../model'
import type { IFormVolumeManagerFeatureEmits } from './form-volume-manager-feature'
import type { ICheckNameReturn } from '@/shared/generated/mock.d'
import { toTypedSchema } from '@vee-validate/zod'
import { watchDebounced } from '@vueuse/core'
import Button from 'primevue/button'
import FloatLabel from 'primevue/floatlabel'
import IconField from 'primevue/iconfield'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'
import { Field, Form } from 'vee-validate'
import { computed, reactive, ref } from 'vue'
import { ECurrentTypeSizeValues, useToggleSizeType } from '@/entities/togglle-size-type'
import { useAsyncOperation } from '@/shared/lib/async-operation'
import { getSizeInBinary, getSizeInDecimal } from '@/shared/lib/format-size-number.ts'
import { z } from '@/shared/lib/zod-validate'
import { FieldMessage } from '@/shared/ui'
import { useFormVolumeManager } from '../model'

const emits = defineEmits<IFormVolumeManagerFeatureEmits>()
const { currentTypeSize } = useToggleSizeType()
const dataForm = reactive<IDataForm>({
  name: '',
  type: 'block', // 'block' or 'file'
  size: null,
})
const isUniqueNameError = ref('')

const { checkValidName } = useFormVolumeManager()

const validationSchema = toTypedSchema(
  z.object({
    name: z.string().min(1),
  }),
)

const {
  call: checkName,
  loading: loadingCheckName,
  errorMessage: errorNameMessage,
} = useAsyncOperation<ICheckNameReturn, [string]>(checkValidName)

watchDebounced(
  () => dataForm.name,
  async () => {
    isUniqueNameError.value = ''
    const result = await checkName(dataForm.name)
    if (result) {
      const { unique } = result
      isUniqueNameError.value = unique ? '' : 'Указанное имя неуникально'
    }
  },
  { debounce: 1000 },
)

const parseSizeLabel = computed(() => {
  if (currentTypeSize.value === ECurrentTypeSizeValues.Binary) {
    return getSizeInBinary(dataForm.size || 0)
  }
  else if (currentTypeSize.value === ECurrentTypeSizeValues.Decimal) {
    return getSizeInDecimal(dataForm.size || 0)
  }
  return '00'
})

function sendForm() {
  emits('sendData', dataForm)
}
</script>

<template>
  <div class="form-manager">
    <Form
      v-slot="{ meta }"
      class="form-manager__form"
      :validation-schema="validationSchema"
      @submit="sendForm"
    >
      <Field
        v-slot="{ errors, field }"
        v-model="dataForm.name"
        name="name"
      >
        <FloatLabel class="w-full">
          <IconField>
            <InputText
              id="name"
              v-bind="field"
              v-keyfilter="/^[A-Za-z0-9-]+$/"
              :model-value="field.value"
              :invalid="!!errors.length || !!errorNameMessage || !!isUniqueNameError"
              class="w-full"
            />
            <label for="name">Имя</label>
            <InputIcon v-if="loadingCheckName" class="pi pi-spin pi-spinner" />
          </IconField>
        </FloatLabel>

        <FieldMessage id="name-error" :errors="[...errors, isUniqueNameError || '', errorNameMessage || ''].filter(Boolean)" />
      </Field>

      <SelectButton
        v-model="dataForm.type"
        :options="['block', 'file']"
        class="mb-6"
      />

      <Field
        v-slot="{ errors, field }"
        v-model="dataForm.size"
        name="size"
      >
        <FloatLabel>
          <InputGroup>
            <InputText
              id="size"
              v-bind="field"
              v-keyfilter.num
              :model-value="field.value"
              :invalid="!!errors.length"
            />
            <label for="size">Размер</label>
            <InputGroupAddon>{{ parseSizeLabel }}</InputGroupAddon>
          </InputGroup>
        </FloatLabel>

        <FieldMessage id="size-error" :errors="errors" />
      </Field>

      <Button
        :disabled="!meta.valid || !!errorNameMessage || !!isUniqueNameError"
        class="form-manager__send-button ml-auto"
        type="submit"
      >
        Отправить данные
      </Button>
    </Form>
  </div>
</template>

<style lang="scss" scoped>
.form-manager {
  padding: pxToRem(20px);

  &__form {
    width: 100%;
  }

  &__send-button {
    display: flex;
  }
}
</style>
