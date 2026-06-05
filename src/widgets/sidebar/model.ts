import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { HomeRoute } from '@/app/router-setup/routes/user-scope-routes'

export interface ISideBarItemRoute {
  label: string
  route: RouteRecordRaw
  icon: string | Component
}

export const menuItems: ISideBarItemRoute[] = [
  {
    label: 'Домашняя',
    route: HomeRoute.raw,
    icon: 'pi pi-home',
  },
]
