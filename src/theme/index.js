import NextPrevNav from './NextPrevNav.vue';
import { useNextPrevNav } from './useNextPrevNav.js';

export function registerNextPrevNav(app) {
  app.component('NextPrevNav', NextPrevNav);
}

export { NextPrevNav, useNextPrevNav };
