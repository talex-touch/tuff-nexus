<script setup lang="ts">
import TuffHome from "~/components/tuff/TuffHome.vue";

definePageMeta({
  layout: "home",
});
</script>

<template>
  <!-- data-home-shell 提供给 useTuffHeroAnimation 恢复 padding 使用 -->
  <div class="px-6 py-16 sm:px-8 lg:px-16" data-home-shell>
    <TuffHome />
  </div>
</template>
