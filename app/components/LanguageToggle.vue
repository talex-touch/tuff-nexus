<script setup lang="ts">
import { useToggle, onClickOutside } from '@vueuse/core'

const { availableLocales, locale, setLocale } = useI18n()
const [isOpen, toggle] = useToggle(false)
const dropdown = ref(null)

onClickOutside(dropdown, () => {
  if (isOpen.value)
    toggle(false)
})

function selectLocale(selectedLocale: string) {
  setLocale(selectedLocale)
  toggle(false)
}
</script>

<template>
  <div ref="dropdown" class="relative">
    <button
      class="!outline-none text-primary/80 dark:text-light/80"
      @click="toggle()"
    >
      <div class="i-carbon-language text-2xl" />
    </button>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white/70 dark:bg-gray-800/70 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none backdrop-blur-sm"
      >
        <div class="py-1">
          <a
            v-for="availableLocale in availableLocales"
            :key="availableLocale"
            href="#"
            class="block px-4 py-2 text-sm"
            :class="locale === availableLocale ? 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'"
            @click.prevent="selectLocale(availableLocale)"
          >
            {{ availableLocale.toUpperCase() }}
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>