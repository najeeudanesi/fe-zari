<template>
  <div class="contents">
    <NuxtLayout>
      <div class="overflow-auto">
        <NuxtPage />
      </div>

    </NuxtLayout>
    <Toasts />
    <LoadingToast v-bind="{ loading }" />
  </div>
</template>

<script setup lang="ts">
import Toasts from './components/ui/toasts.vue'
import LoadingToast from './components/ui/loading-toast.vue'

// refs
const router = useRouter()
const loading = ref(false)

// logic
router.beforeEach(() => (loading.value = true))
router.afterEach(() => (loading.value = false))
</script>
