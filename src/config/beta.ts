export const BETA_MODE = typeof window !== 'undefined'
  && localStorage.getItem('cyberspace-beta-mode') === 'true';
