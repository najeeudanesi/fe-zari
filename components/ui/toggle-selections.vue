<template>
  <div class="flex cursor-pointer justify-center">
    <button
      class="flex h-5 w-5 items-center justify-center rounded border-2"
      @click="toggleSelections"
    >
      <Icon
        v-if="modelValue.length >= data.length && data.length >= 1"
        name="check"
        class="h-4 text-primary"
      />
      <Icon
        v-else-if="modelValue.length > 0 && data.length >= 1"
        name="minus"
        class="h-4 text-primary"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import Icon from './icon.vue'
// defines
const props = defineProps<{
  modelValue: unknown[]
  data?: unknown[]
  mapFn: (v: unknown) => unknown
}>()
const emit = defineEmits(['update:modelValue'])

// refs
const data = computed(() => props.data || [])

// methods
const toggleSelections = () => {
  if (props.modelValue.length > 0) {
    emit('update:modelValue', [])
  } else {
    emit('update:modelValue', data.value.map(props.mapFn))
  }
}
</script>
