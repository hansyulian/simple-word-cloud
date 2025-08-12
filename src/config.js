const env = import.meta.env;

export const appConfig = {
  apiEndpoint: env.VITE_API_ENDPOINT,
  wordOptions: env.VITE_WORD_OPTIONS.split(','),
  enableFreeText: env.VITE_ENABLE_FREE_TEXT === 'true',
}