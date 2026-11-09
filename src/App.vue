<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'
import AppToast from '@/components/AppToast.vue'
import { notifyPageEntered } from '@/router'
</script>

<template>
  <div class="app-shell">
    <AppNavbar />

    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in" @enter="notifyPageEntered">
        <component :is="Component" />
      </Transition>
    </RouterView>

    <AppFooter />
    <AppToast />
  </div>
</template>

<style>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-shell > main,
.app-shell > section {
  flex: 1;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.4s var(--ease-out-expo),
    transform 0.5s var(--ease-out-expo);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
