<template>
  <div>
    <div class="flex justify-between">
      <Card style="width: 49.5%;" :loading="loading">
        <VisitAnalysis />
      </Card>
      <Card style="width: 49.5%;" :loading="loading">
        <VisitAnalysisBar />
      </Card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Card } from 'ant-design-vue'
import VisitAnalysis from './VisitAnalysis.vue'
import VisitAnalysisBar from './VisitAnalysisBar.vue'

defineProps({
  loading: {
    type: Boolean
  }
})
</script>
