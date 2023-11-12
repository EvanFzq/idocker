export const isDev = import.meta.env.VITE_ENV === 'dev';
export const isMobile = 'ontouchstart' in document.documentElement;
