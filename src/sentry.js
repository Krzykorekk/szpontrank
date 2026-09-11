import * as Sentry from '@sentry/capacitor'
import * as SentryReact from '@sentry/react'
import { Capacitor } from '@capacitor/core'

// DSN Sentry (publiczny identyfikator, bezpieczny do trzymania w kodzie - nie sekret)
const SENTRY_DSN =
  'https://f3dec9d17861fc3f45f31339e5829642@o4512051966115840.ingest.de.sentry.io/4512066080014416'

export function inicjalizujSentry() {
  Sentry.init(
    {
      dsn: SENTRY_DSN,
      // 'production' na buildach appki natywnej, 'web' na stronie (import.meta.env.DEV
      // dodatkowo odroznia lokalny dev od prawdziwego builda produkcyjnego strony)
      environment: Capacitor.isNativePlatform()
        ? 'android'
        : import.meta.env.DEV
          ? 'development'
          : 'web',
      // Nie potrzebujemy sledzenia wydajnosci (tracing) ani session replay na
      // start - same bledy JS/crashe wystarcza, taniej i prosciej.
      tracesSampleRate: 0,
    },
    SentryReact.init
  )
}
