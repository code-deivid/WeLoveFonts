<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useScrolled } from "@/composables/useScrolled";
import AppLogo from "./AppLogo.vue";
import ThemeToggle from "./ThemeToggle.vue";

const links = [
  { to: "/fonts", label: "Fuentes" },
  { to: "/word-counter", label: "Contador" },
  { to: "/converter", label: "Conversor" },
];

const { scrolled: isCondensed } = useScrolled(16);
const route = useRoute();
const isMenuOpen = ref(false);
const menuButton = ref<HTMLButtonElement | null>(null);

function closeMenu() {
  isMenuOpen.value = false;
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

// Escape cierra el menú y devuelve el foco al botón que lo abrió.
function handleKeydown(event: KeyboardEvent) {
  if (event.key !== "Escape" || !isMenuOpen.value) return;
  closeMenu();
  menuButton.value?.focus();
}

// El menú solo existe en móvil: si la ventana se ensancha, se cierra.
// Debe coincidir con el breakpoint de la media query del final.
const desktopQuery = window.matchMedia("(min-width: 641px)");

watch(() => route.fullPath, closeMenu);
onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  desktopQuery.addEventListener("change", closeMenu);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  desktopQuery.removeEventListener("change", closeMenu);
});
</script>

<template>
  <header
    class="site-header"
    :class="{ 'is-condensed': isCondensed, 'is-menu-open': isMenuOpen }"
  >
    <div class="site-header__bar">
      <RouterLink
        to="/"
        class="site-header__brand"
        aria-label="WeLoveFonts, inicio"
      >
        <AppLogo :size="30" />
      </RouterLink>

      <nav class="site-header__nav" aria-label="Herramientas">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="site-header__actions">
        <ThemeToggle />
        <button
          ref="menuButton"
          type="button"
          class="menu-button"
          aria-controls="mobile-menu"
          :aria-expanded="isMenuOpen"
          :aria-label="isMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
          @click="toggleMenu"
        >
          <span class="menu-button__line" aria-hidden="true"></span>
          <span class="menu-button__line" aria-hidden="true"></span>
        </button>
      </div>
    </div>

    <!-- Menú móvil: se despliega bajo la barra, sin cambiar su estructura -->
    <Transition name="menu">
      <nav
        v-if="isMenuOpen"
        id="mobile-menu"
        class="mobile-menu"
        aria-label="Herramientas"
      >
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="mobile-menu__link"
          @click="closeMenu"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </Transition>
    <Transition name="scrim">
      <div
        v-if="isMenuOpen"
        class="mobile-scrim"
        aria-hidden="true"
        @click="closeMenu"
      ></div>
    </Transition>
  </header>
</template>

<style scoped>
/* ===========================================================
   BARRA — misma estructura antes y después del scroll.
   Al desplazarse solo cambian la altura, el fondo y el borde.
   =========================================================== */
.site-header {
  --header-height: 72px;

  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
}

.site-header.is-condensed {
  --header-height: 56px;
}

/*
 * El fondo va en un pseudo-elemento: si el backdrop-filter estuviera en
 * .site-header, el velo del menú móvil (position: fixed) quedaría recortado
 * dentro de la cabecera en lugar de cubrir la página.
 */
.site-header::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: color-mix(in srgb, var(--bg) 86%, transparent);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  border-bottom: 1px solid var(--border);
  opacity: 0;
  transition: opacity 0.3s var(--ease-out-quart);
}

.site-header.is-condensed::before,
.site-header.is-menu-open::before {
  opacity: 1;
}

/* Con el menú abierto el fondo es opaco para que el panel se lea limpio */
.site-header.is-menu-open::before {
  background: var(--bg);
}

.site-header__bar {
  max-width: 1240px;
  height: var(--header-height);
  margin: 0 auto;
  padding-inline: clamp(20px, 5vw, 64px);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
  transition: height 0.3s var(--ease-out-quart);
}

.site-header__brand {
  justify-self: start;
  display: inline-flex;
  color: inherit;
  text-decoration: none;
  border-radius: var(--r-sm);
}

/* ===========================================================
   NAVEGACIÓN — subrayado fino para el enlace activo
   =========================================================== */
.site-header__nav {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 36px);
}

.nav-link {
  position: relative;
  padding: 6px 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ink-soft);
  text-decoration: none;
  transition: color 0.2s var(--ease-smooth);
}

.nav-link::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.35s var(--ease-out-expo);
}

.nav-link:hover {
  color: var(--ink);
}

.nav-link[aria-current="page"] {
  color: var(--ink);
}

.nav-link[aria-current="page"]::after {
  transform: scaleX(1);
}

.site-header__actions {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ===========================================================
   BOTÓN DE MENÚ — mismo formato que el botón de tema
   =========================================================== */
.menu-button {
  display: none;
  width: 38px;
  height: 38px;
  padding: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--ink);
  cursor: pointer;
  transition:
    background 0.2s var(--ease-smooth),
    border-color 0.2s var(--ease-smooth);
}

.menu-button:hover {
  background: var(--bg-subtle);
  border-color: var(--border-hover);
}

.menu-button__line {
  display: block;
  width: 16px;
  height: 1.5px;
  border-radius: 2px;
  background: currentColor;
  transition: transform 0.35s var(--ease-out-expo);
}

.is-menu-open .menu-button__line:first-child {
  transform: translateY(2.75px) rotate(45deg);
}

.is-menu-open .menu-button__line:last-child {
  transform: translateY(-2.75px) rotate(-45deg);
}

/* ===========================================================
   MENÚ MÓVIL
   =========================================================== */
.mobile-menu {
  position: absolute;
  top: 100%;
  inset-inline: 0;
  display: flex;
  flex-direction: column;
  padding: 8px clamp(20px, 5vw, 64px) 24px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}

.mobile-menu__link {
  padding: 14px 0;
  font-family: var(--font-display);
  font-size: 1.75rem;
  line-height: 1.2;
  color: var(--ink-soft);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
  transition: color 0.2s var(--ease-smooth);
}

.mobile-menu__link:last-child {
  border-bottom: 0;
}

.mobile-menu__link:hover,
.mobile-menu__link[aria-current="page"] {
  color: var(--ink);
}

.mobile-menu__link[aria-current="page"] {
  font-style: italic;
  font-weight: bold;
  letter-spacing: .03rem;

}

.mobile-scrim {
  position: fixed;
  inset: 0;
  z-index: -2;
  background: color-mix(in srgb, var(--bg) 55%, transparent);
}

.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.25s var(--ease-out-quart),
    transform 0.3s var(--ease-out-quart);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.scrim-enter-active,
.scrim-leave-active {
  transition: opacity 0.25s var(--ease-out-quart);
}

.scrim-enter-from,
.scrim-leave-to {
  opacity: 0;
}

/* Por debajo de 640px los enlaces se mueven al menú desplegable */
@media (max-width: 640px) {
  .site-header {
    --header-height: 64px;
  }

  .site-header.is-condensed {
    --header-height: 56px;
  }

  .site-header__bar {
    grid-template-columns: 1fr auto;
  }

  .site-header__nav {
    display: none;
  }

  .menu-button {
    display: flex;
  }
}
</style>
