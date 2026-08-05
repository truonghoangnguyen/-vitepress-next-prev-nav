<script setup>
import { useNextPrevNav } from './useNextPrevNav.js';

const { prev, next } = useNextPrevNav();
</script>

<template>
  <nav class="next-prev-nav" v-if="prev || next">
    <a
      v-if="prev"
      :href="prev.link"
      class="next-prev-nav__link next-prev-nav__prev"
    >
      <span class="next-prev-nav__label">← {{ prev.text }}</span>
    </a>
    <span v-else class="next-prev-nav__spacer" />

    <a
      v-if="next"
      :href="next.link"
      class="next-prev-nav__link next-prev-nav__next"
    >
      <span class="next-prev-nav__label">{{ next.text }} →</span>
    </a>
  </nav>
</template>

<style scoped>
.next-prev-nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.next-prev-nav__link {
  text-decoration: none;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

.next-prev-nav__link:hover {
  text-decoration: underline;
}

.next-prev-nav__prev {
  text-align: left;
}

.next-prev-nav__next {
  text-align: right;
}
</style>
