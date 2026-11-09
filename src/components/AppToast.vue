<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { isVisible, message, tone } = useToast()
</script>

<template>
  <Transition name="toast">
    <div v-if="isVisible" class="toast" role="status" aria-live="polite">
      <span class="toast-icon" aria-hidden="true">
        <svg
          v-if="tone === 'success'"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg
          v-else
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </span>
      <span>{{ message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px 12px 14px;
  background: var(--ink);
  color: var(--bg);
  border-radius: 999px;
  box-shadow:
    var(--shadow-xl),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  pointer-events: none;
}

.toast-icon {
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: var(--bg);
}

.toast-enter-active {
  animation: toast-in 0.45s var(--ease-spring);
}
.toast-leave-active {
  animation: toast-out 0.3s var(--ease-out-expo);
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(40px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}
@keyframes toast-out {
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
}

@media (max-width: 480px) {
  .toast {
    bottom: 20px;
    font-size: 0.8125rem;
    padding: 10px 16px 10px 12px;
  }
}
</style>
