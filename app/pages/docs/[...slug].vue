<script setup lang="ts">
definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const docPath = computed(() => {
  const rawPath = route.path.endsWith('/') && route.path.length > 1
    ? route.path.slice(0, -1)
    : route.path
  return rawPath || '/docs'
})

const { data: doc, status } = await useAsyncData(
  () => `doc:${docPath.value}`,
  () => queryCollection('docs').path(docPath.value).first(),
  { watch: [docPath] },
)
</script>

<template>
  <div class="prose dark:prose-invert max-w-none">
    <div v-if="status === 'pending'" class="py-12 text-center text-gray-500 dark:text-gray-400">
      正在加载文档内容…
    </div>
    <ContentRenderer v-else-if="doc" :value="doc" />
    <div v-else class="space-y-4 rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-primary/60">
      <div class="text-4xl text-primary dark:text-light">
        <div class="i-carbon-warning inline-block" />
      </div>
      <div class="text-lg font-semibold text-primary dark:text-light">未找到文档</div>
      <p class="text-sm text-gray-500 dark:text-gray-300">
        当前路径没有匹配的 Markdown 文件，请检查目录或返回文档首页。
      </p>
      <NuxtLink
        to="/docs"
        class="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
      >
        返回文档首页
      </NuxtLink>
    </div>
  </div>
</template>
