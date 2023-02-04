<template>
  <div class="p-4 flex justify-between">

    <div style="width: 69.5%;">
      <GrowCard :loading="loading" class="enter-y" />
      <SalesProductPie class="!my-4 enter-y " :loading="loading" />

      <SiteAnalysis class="!my-4 enter-y" :loading="loading" />
    </div>

    <div style="width: 29.5%;">
      <VisitSource :loading="loading"></VisitSource>
      <help class="!my-4" :loading="loading"></help>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import GrowCard from './components/GrowCard.vue'
import SiteAnalysis from './components/SiteAnalysis.vue'
import VisitSource from './components/VisitSource.vue'
import help from './components/help.vue'
import SalesProductPie from './components/SalesProductPie.vue'

const loading = ref(true)

setTimeout(() => {
  loading.value = false
}, 1500)
</script>
