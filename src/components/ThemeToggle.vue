<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'"
    @click="toggleTheme"
  >
    <svg
      class="icon"
      :class="{ 'is-dark': theme === 'dark' }"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <!-- Sol -->
      <g class="sun">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </g>
      <!-- Luna -->
      <g class="moon">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </g>
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--ink-soft);
  cursor: pointer;
  transition:
    background 0.3s var(--ease-smooth),
    border-color 0.3s var(--ease-smooth),
    color 0.3s var(--ease-smooth),
    transform 0.4s var(--ease-out-expo);
}

.theme-toggle:hover {
  border-color: var(--border-hover);
  background: var(--bg-subtle);
  color: var(--ink);
  transform: rotate(-8deg);
}

.icon {
  position: relative;
  transition: transform 0.7s var(--ease-out-expo);
}

.sun,
.moon {
  transition:
    opacity 0.35s var(--ease-smooth),
    transform 0.5s var(--ease-out-expo);
  transform-origin: center;
}

.moon {
  opacity: 0;
  transform: scale(0.4) rotate(-40deg);
}

.icon.is-dark .sun {
  opacity: 0;
  transform: scale(0.4) rotate(40deg);
}
.icon.is-dark .moon {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}
</style>
