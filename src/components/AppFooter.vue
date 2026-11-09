<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppLogo from './AppLogo.vue'

const year = new Date().getFullYear()

type FooterLink = { label: string; to: string } | { label: string; href: string }

interface FooterLinkGroup {
  title: string
  links: FooterLink[]
}

const linkGroups: FooterLinkGroup[] = [
  {
    title: 'Herramientas',
    links: [
      { to: '/fonts', label: 'Generador de fuentes' },
      { to: '/word-counter', label: 'Contador de palabras' },
      { to: '/converter', label: 'Conversor de texto' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { href: 'https://github.com/code-deivid', label: 'GitHub' },
      { href: 'https://www.instagram.com/code_deivid/', label: 'Instagram' },
    ],
  },
]
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <AppLogo :size="36" />
          <p class="footer-tagline">
            Herramientas de texto refinadas, diseñadas para creadores que cuidan cada letra.
          </p>
        </div>

        <div class="footer-grid">
          <div v-for="group in linkGroups" :key="group.title" class="footer-col">
            <h4>{{ group.title }}</h4>
            <ul>
              <li v-for="link in group.links" :key="link.label">
                <a
                  v-if="'href' in link"
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ link.label }}
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
                  </svg>
                </a>
                <RouterLink v-else :to="link.to">{{ link.label }}</RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="hairline"></div>

      <div class="footer-bottom">
        <p>
          © {{ year }} WeLoveFonts · Hecho con cuidado por
          <a href="https://github.com/code-deivid" target="_blank" rel="noopener noreferrer"
            >DEiVid</a
          >
        </p>
        <div class="footer-social">
          <a
            href="https://github.com/code-deivid"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.16c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18.92-.26 1.9-.39 2.87-.39.97 0 1.95.13 2.87.39 2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"
              />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/code_deivid/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: clamp(80px, 12vw, 160px);
  padding-block: clamp(48px, 7vw, 96px);
  border-top: 1px solid var(--border);
  background: var(--bg);
  position: relative;
}

.footer-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding-inline: clamp(20px, 5vw, 64px);
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.4fr 2fr;
  gap: clamp(32px, 6vw, 80px);
}

.footer-brand {
  max-width: 360px;
}

.footer-tagline {
  margin-top: 18px;
  color: var(--ink-muted);
  font-size: 0.9375rem;
  line-height: 1.55;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 48px;
}

.footer-col h4 {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
  margin: 0 0 18px;
}

.footer-col ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-col a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink-soft);
  text-decoration: none;
  font-size: 0.9375rem;
  transition:
    color 0.25s var(--ease-smooth),
    transform 0.4s var(--ease-out-expo);
}

.footer-col a:hover {
  color: var(--ink);
  transform: translateX(3px);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-bottom p {
  margin: 0;
  color: var(--ink-faint);
  font-size: 0.8125rem;
  letter-spacing: -0.005em;
}
.footer-bottom a {
  color: var(--ink-soft);
  text-decoration: none;
  border-bottom: 1px dashed var(--border-strong);
  padding-bottom: 1px;
  transition:
    color 0.25s var(--ease-smooth),
    border-color 0.25s var(--ease-smooth);
}
.footer-bottom a:hover {
  color: var(--ink);
  border-color: var(--ink);
}

.footer-social {
  display: flex;
  gap: 8px;
}
.footer-social a {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  border: 1px solid var(--border);
  color: var(--ink-soft);
  border-bottom: 1px solid var(--border);
  transition:
    color 0.3s var(--ease-smooth),
    border-color 0.3s var(--ease-smooth),
    background 0.3s var(--ease-smooth),
    transform 0.4s var(--ease-out-expo);
}
.footer-social a:hover {
  color: var(--ink);
  border-color: var(--border-hover);
  background: var(--bg-subtle);
  transform: translateY(-3px);
}

@media (max-width: 768px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .footer-grid {
    gap: 32px;
  }
}
@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
