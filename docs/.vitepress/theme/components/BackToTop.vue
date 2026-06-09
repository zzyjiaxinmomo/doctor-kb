<template>
  <button
    class="back-to-top"
    @click="scrollToTop"
    title="回到顶部"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m18 15-6-6-6 6"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.back-to-top {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-default-2);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-to-top:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}
</style>
