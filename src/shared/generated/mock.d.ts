export interface ICheckNameReturn {
  unique: boolean
}

export interface IMockApi {
  checkName: (name: string) => Promise<ICheckNameReturn>
}