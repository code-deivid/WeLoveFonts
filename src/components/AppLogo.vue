
<script setup lang="ts">
import logoHeader from '@/assets/svg/LogoHeader.svg'

withDefaults(
  defineProps<{
    size?: number
  }>(),
  {
    size: 36,
  },
)
</script>

<template>
  <div class="logo-mark" :style="{ '--logo-size': `${size}px` }">
    <img
      :src="logoHeader"
      alt=""
      class="logo-icon"
      aria-hidden="true"
      draggable="false"
    />

    <span class="logo-word">WeLoveFonts</span>
  </div>
</template>

<style scoped>
.logo-mark {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  user-select: none;
  white-space: nowrap;
}

.logo-icon {
  display: block;
  width: auto;
  height: var(--logo-size);
  max-width: 100%;
  object-fit: contain;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}



.logo-word {
  font-family: 'Korcy Oblique', serif;
  font-size: 2rem;
  font-weight: bolder;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--ink);
}

@media (max-width: 480px) {
  .logo-mark {
    gap: 8px;
  }

  .logo-word {
    font-size: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .logo-icon {
    transition: none;
  }

  .logo-mark:hover .logo-icon {
    transform: none;
  }
}
</style>

<!-- Sin scoped: el selector completo apunta solo a la imagen, nunca al elemento html. -->
<style>
html[data-theme='dark'] img.logo-icon {
  filter: brightness(0) invert(1);
}
</style>
