<template>
  <a href="/doctor-kb" class="nav-bar-logo">
    <img
      src="/images/brand/C-logo-01.png"
      alt="可丽尔"
      class="nav-bar-logo-icon"
      @error="onIconError"
    />
    <img
      src="/images/brand/logo-text.png"
      alt="可丽尔"
      class="nav-bar-logo-text"
      @error="onTextError"
    />
    <template v-if="iconFallback">
      <svg class="logo-c-fallback" viewBox="0 0 40 40" width="30" height="30">
        <defs>
          <linearGradient id="cf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1671DA"/>
            <stop offset="100%" stop-color="#4D94E4"/>
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="20" fill="url(#cf)"/>
        <path d="M25 12.5C23 11 21 10.5 19 10.5 14 10.5 10 14.5 10 19.5S14 28.5 19 28.5C21 28.5 23 28 25 26.5"
              stroke="white" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      </svg>
    </template>
    <template v-if="textFallback">
      <span class="logo-text-fallback">可丽尔</span>
    </template>
  </a>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const iconFallback = ref(false)
const textFallback = ref(false)

function onIconError() { iconFallback.value = true }
function onTextError() { textFallback.value = true }
</script>

<style scoped>
.nav-bar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  height: 28px;
}
.nav-bar-logo-icon {
  height: 28px;
  width: auto;
  object-fit: contain;
}
.nav-bar-logo-text {
  height: 18px;
  width: auto;
  object-fit: contain;
}
.logo-c-fallback { flex-shrink: 0; }
.logo-text-fallback {
  font-size: 15px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: 0.5px;
}
</style>
