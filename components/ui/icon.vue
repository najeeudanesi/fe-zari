<template>
  <IconComponent v-bind="$attrs" />
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { defineAsyncComponent, onMounted, ref } from 'vue'

// defines
const props = defineProps<{ name: string }>()

// hooks
onMounted(() => {
  isMounted.value = true
})

// refs
const isMounted = ref(false)
const IconComponent = computed(() =>
  defineAsyncComponent(() => import(`./icons/${props.name}.vue`))
)
</script>
