import { describe, expect, it, vi } from 'vitest'
import { useFormVolumeManager } from '@/features/form-volume-manager'

const checkNameMock = vi.fn()

vi.mock('@/shared/generated/mock.ts', () => ({
  mockApi: {
    checkName: (name: string) => checkNameMock(name),
  },
}))

describe('features/form-volume-manager/useFormVolumeManager', () => {
  it('returns checkValidName function', () => {
    const { checkValidName } = useFormVolumeManager()

    expect(checkValidName).toBeTypeOf('function')
  })

  it('delegates name validation to mockApi.checkName', async () => {
    checkNameMock.mockResolvedValueOnce({ unique: true })

    const { checkValidName } = useFormVolumeManager()
    const result = await checkValidName('new-volume')

    expect(checkNameMock).toHaveBeenCalledOnce()
    expect(checkNameMock).toHaveBeenCalledWith('new-volume')
    expect(result).toEqual({ unique: true })
  })

  it('returns non-unique result from mockApi', async () => {
    checkNameMock.mockResolvedValueOnce({ unique: false })

    const { checkValidName } = useFormVolumeManager()
    const result = await checkValidName('fast-storage')

    expect(checkNameMock).toHaveBeenCalledWith('fast-storage')
    expect(result).toEqual({ unique: false })
  })
})
