<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGsapReveal } from '~/composables/useGsapReveal'

interface Persona {
  id: string
  title: string
  copy: string
  quote: string
  name: string
  role: string
  icon: string
  accent: string
}

interface Stat {
  id: string
  label: string
  value: string
  icon: string
}

interface BuiltForYouContent {
  eyebrow: string
  headline: string
  subheadline: string
  personas: Persona[]
  stats: Stat[]
}

const props = defineProps<{
  builtForYou: BuiltForYouContent
}>()

const sectionRef = ref<HTMLElement | null>(null)
const builtForYou = computed(() => props.builtForYou)
const personas = computed(() => builtForYou.value.personas ?? [])
const stats = computed(() => builtForYou.value.stats ?? [])

useGsapReveal(sectionRef, {
  from: {
    opacity: 0,
    y: 34,
    duration: 1,
  },
})
</script>

<template>
  <section
    ref="sectionRef"
    class="relative isolate min-h-screen flex flex-col justify-center overflow-hidden bg-black py-24 text-white"
  >
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-y-0 left-[-240px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(79,70,229,0.24),_transparent_70%)] blur-3xl" />
      <div class="absolute bottom-[-180px] right-[-220px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.22),_transparent_70%)] blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-6xl w-full px-6 space-y-10">
      <TuffStickyBar>
        {{ builtForYou.eyebrow }}
      </TuffStickyBar>

      <header class="text-center">
        <h2 class="my-0 text-[clamp(.7rem,1vw+1.4rem,1.2rem)] font-bold leading-tight">
          {{ builtForYou.headline }}
        </h2>
        <p class="mx-auto my-0 max-w-3xl text-[clamp(.6rem,1vw+1.3rem,1.1rem)] font-semibold leading-relaxed op-70">
          {{ builtForYou.subheadline }}
        </p>
      </header>

      <div class="grid gap-6 lg:grid-cols-3">
        <article
          v-for="persona in personas"
          :key="persona.id"
          data-reveal
          class="group relative h-full flex flex-col gap-6 overflow-hidden border border-white/12 rounded-[30px] bg-white/5 p-8 text-left text-white shadow-[0_28px_110px_rgba(10,18,52,0.36)] transition duration-300 hover:border-white/25 hover:bg-white/9 hover:-translate-y-1"
        >
          <div class="pointer-events-none absolute inset-0 opacity-80 transition duration-300 group-hover:opacity-100" :class="persona.accent" />
          <div class="relative space-y-5">
            <span class="size-12 inline-flex items-center justify-center rounded-2xl bg-white/15 text-white shadow-[0_18px_45px_rgba(5,16,48,0.4)]">
              <span :class="persona.icon" class="text-xl" aria-hidden="true" />
            </span>
            <div class="space-y-2">
              <h3 class="text-xl font-semibold leading-tight">
                {{ persona.title }}
              </h3>
              <p class="text-sm text-white/70 leading-relaxed">
                {{ persona.copy }}
              </p>
            </div>
            <blockquote class="border-l-2 border-white/20 pl-4 text-sm text-white/70 leading-relaxed italic">
              {{ persona.quote }}
            </blockquote>
            <footer class="text-sm text-white/60 space-y-1">
              <p class="text-white font-semibold">
                {{ persona.name }}
              </p>
              <p>
                {{ persona.role }}
              </p>
            </footer>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
