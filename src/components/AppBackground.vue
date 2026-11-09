<script setup lang="ts">
import { ref } from 'vue'
import { useMouseParallax } from '@/composables/useMouseParallax'

const props = withDefaults(
  defineProps<{
    showOrbs?: boolean
    intensity?: number
  }>(),
  { showOrbs: true, intensity: 1 },
)

const root = ref<HTMLElement | null>(null)
useMouseParallax(root, props.intensity * 0.6)
</script>

<template>
  <div ref="root" class="bg-canvas" aria-hidden="true">
    <div class="bg-grid"></div>

    <template v-if="showOrbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </template>

    <div class="vignette"></div>
  </div>
</template>

<style scoped>
.bg-canvas {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  --px: 0;
  --py: 0;
}

.bg-grid {
  position: absolute;
  inset: -10%;
  background-image:
    linear-gradient(to right, var(--bg-grid) 1px, transparent 1px),
    linear-gradient(to bottom, var(--bg-grid) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 35%, black 35%, transparent 95%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 35%, black 35%, transparent 95%);
  animation: drift 80s linear infinite;
  transform: translate3d(calc(var(--px) * -10px), calc(var(--py) * -10px), 0);
  transition: transform 0.8s var(--ease-out-expo);
}

@keyframes drift {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 56px 56px;
  }
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  will-change: transform;
  transition: transform 1s var(--ease-out-expo);
}

.orb-1 {
  width: 480px;
  height: 480px;
  top: -120px;
  left: -120px;
  background: radial-gradient(circle, rgba(228, 228, 231, 0.7), transparent 70%);
  transform: translate3d(calc(var(--px) * 30px), calc(var(--py) * 30px), 0);
}

.orb-2 {
  width: 420px;
  height: 420px;
  top: 30%;
  right: -160px;
  background: radial-gradient(circle, rgba(212, 212, 216, 0.55), transparent 70%);
  transform: translate3d(calc(var(--px) * -40px), calc(var(--py) * 25px), 0);
}

.orb-3 {
  width: 380px;
  height: 380px;
  bottom: -120px;
  left: 30%;
  background: radial-gradient(circle, rgba(244, 244, 245, 0.6), transparent 70%);
  transform: translate3d(calc(var(--px) * 20px), calc(var(--py) * -30px), 0);
}

[data-theme='dark'] .orb-1 {
  background: radial-gradient(circle, rgba(63, 63, 70, 0.5), transparent 70%);
  opacity: 0.6;
}
[data-theme='dark'] .orb-2 {
  background: radial-gradient(circle, rgba(39, 39, 42, 0.55), transparent 70%);
}
[data-theme='dark'] .orb-3 {
  background: radial-gradient(circle, rgba(82, 82, 91, 0.45), transparent 70%);
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 100% 80% at 50% 100%, transparent 50%, var(--bg) 100%);
}
</style>
