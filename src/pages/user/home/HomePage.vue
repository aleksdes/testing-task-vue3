<script setup lang="ts">
import type { IDataForm } from '@/features/form-volume-manager'
import { ref } from 'vue'
import { ToggleSizeType } from '@/entities/togglle-size-type'
import { FormVolumeManagerFeature } from '@/features/form-volume-manager'
import { BaseHeaderPage } from '@/widgets/header-page'

const dataForm = ref({})

function onSendDate(data: IDataForm) {
  const dataVisibility: Pick<IDataForm, 'size'> & { sizeBytes: number } = {
    ...data,
    sizeBytes: data.size || 0,
  }
  delete dataVisibility.size

  dataForm.value = dataVisibility
}
</script>

<template>
  <div class="home-page">
    <BaseHeaderPage
      title="Домашняя"
      sticky
    >
      <template #append>
        <div class="ml-auto mr-4">
          <ToggleSizeType />
        </div>
      </template>
    </BaseHeaderPage>

    <div class="p-[18px] md:p-0">
      <div class="wrapper-card">
        <div class="content-container">
          <div>
            <FormVolumeManagerFeature
              @send-data="onSendDate"
            />
          </div>

          <div>
            <pre>{{ dataForm }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper-card {
  --card--background: white;
  --card--padding: #{pxToRem(17px)} #{pxToRem(24px)};
  --card--padding-sm: #{pxToRem(18px)} #{pxToRem(18px)};

  background-color: var(--card--background);
  padding: var(--card--padding-sm);
  margin: 0 auto pxToRem(10px);
  border-radius: var(--radius-2xl);
  box-shadow: 0 0 2px 0 rgba(18, 18, 23, 0.05);

  @media (min-width: 768px) {
    border-radius: var(--radius-3xl);
    box-shadow: none;
    padding: var(--card--padding);
    width: 100%;
    margin: 0 0 pxToRem(10px);
  }
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: pxToRem(15px);
}

pre {
  min-height: pxToRem(250px);
  /* Базовый дизайн контейнера */
  background-color: #d3d1d1;
  color: #35363c;
  padding: 16px;
  border-radius: 8px;

  /* Шрифт и отступы */
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;

  /* Управление отображением и переносами */
  overflow-x: auto; /* Горизонтальная прокрутка при необходимости */
  white-space: pre; /* Сохранение всех пробелов и табуляций */
}
</style>
