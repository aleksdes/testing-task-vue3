import type { App } from 'vue'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import { ConfirmationService, DialogService, ToastService } from 'primevue'
import PrimeVue from 'primevue/config'
import KeyFilter from 'primevue/keyfilter'
import Tooltip from 'primevue/tooltip'
import { ru } from './locales/ru'
import 'primeicons/primeicons.css'

export function usePrimeVueSetup(app: App) {
  app.use(DialogService)
  app.use(ToastService)
  app.use(ConfirmationService)
  app.use(PrimeVue, {
    locale: ru,
    theme: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      preset: definePreset(Aura, {
        semantic: {
          primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}',
          },
          // border: {
          //   radius: {
          //     xs: 0,
          //     sm: 0,
          //     md: 0,
          //     lg: 0,
          //     xl: 0,
          //   },
          // },

          // colorScheme: {
          //   light: {
          //     content: {
          //       borderColor: '{surface.300}',
          //     },
          //     formField: {
          //       borderColor: '{surface.300}',
          //       hoverBorderColor: '{surface.400}',
          //       focusRing: {
          //         color: '{primary.400}',
          //         width: '1px',
          //       },
          //     },
          //   },
          // },
        },
      }),
      options: {
        darkModeSelector: '.app-dark',
      },
    },
  })
  app.directive('tooltip', Tooltip)
  app.directive('keyfilter', KeyFilter)
}
