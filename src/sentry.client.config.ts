import * as Sentry from '@sentry/react';

Sentry.init({
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
});