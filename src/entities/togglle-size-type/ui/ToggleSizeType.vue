<script setup lang="ts">
import SelectButton from 'primevue/selectbutton'
import { ref } from 'vue'
import { ECurrentTypeSizeValues, useToggleSizeType } from '../model'

const { currentTypeSize } = useToggleSizeType()
const options = ref([
  { name: 'Двоичный', value: ECurrentTypeSizeValues.Binary },
  { name: 'Десятичный', value: ECurrentTypeSizeValues.Decimal },
])
</script>

<template>
  <SelectButton
    v-model="currentTypeSize"
    option-label="name"
    option-value="value"
    :options="options"
    :allow-empty="false"
  />
</template>

<style lang="scss" scoped>

</style>
