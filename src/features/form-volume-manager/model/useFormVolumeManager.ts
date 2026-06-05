import type { ICheckNameReturn } from '@/shared/generated/mock.d'
import { mockApi } from '@/shared/generated/mock.ts'

export interface IDataForm {
  name: string
  type: 'block' | 'file'
  size?: number | null
}

interface IUseFormVolumeManagerReturn {
  checkValidName: (name: string) => Promise<ICheckNameReturn>
}

export function useFormVolumeManager(): IUseFormVolumeManagerReturn {
  const api = mockApi

  async function checkValidName(name: string): Promise<ICheckNameReturn> {
    return await api.checkName(name)
  }

  return {
    checkValidName,
  }
}
