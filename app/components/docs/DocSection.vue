<script lang="ts" setup>
interface Props {
  active: boolean
  link?: string
  list?: number
}

const props = withDefaults(defineProps<Props>(), {
  link: undefined,
  list: 0,
})

const linkable = computed(() => props.list <= 0)
</script>

<template>
  <div class="DocSection flex flex-col">
    <div class="DocSection-Header w-full flex cursor-pointer items-center justify-between px-4 py-2">
      <span class="!text-black !font-medium !dark:text-white">
        <slot v-if="!linkable" name="header" />
        <NuxtLink v-else class="text-inherit no-underline" :to="link">
          <slot name="header" />
        </NuxtLink>
      </span>

      <span
        v-if="!linkable"
        class="i-carbon-chevron-down text-base transition-transform duration-200"
        :class="active ? 'rotate-180 text-black dark:text-light' : 'text-black/40 dark:text-light/40'"
      />

      <span
        v-else
        class="i-carbon-arrow-up-right text-base"
        :class="active ? 'text-black dark:text-light' : 'text-black/40 dark:text-light/40'"
      />
    </div>
    <div class="DocSection-Main">
      <transition
        enter-active-class="overflow-hidden transition-[max-height,opacity] duration-200 ease-out"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-[480px] opacity-100"
        leave-active-class="overflow-hidden transition-[max-height,opacity] duration-150 ease-in"
        leave-from-class="max-h-[480px] opacity-100"
        leave-to-class="max-h-0 opacity-0"
      >
        <ul
          v-if="active && list > 0"
          class="m-0 flex flex-col list-none gap-1 border-t border-primary/5 bg-white/80 px-2 py-0 dark:border-light/10 dark:bg-dark/60"
        >
          <slot />
        </ul>
      </transition>
    </div>
  </div>
</template>
