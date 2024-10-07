<template>
  <div class="relative flex w-full flex-col text-sm text-gray-600" placeholder="">
    <label v-if="label" :for="id" class="mb-2 flex h-4 items-center text-xs">{{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
      <Icon v-if="tooltip" :title="tooltip" name="question-circle-fill" class="ml-2 h-4 w-4 cursor-pointer" />
    </label>
    <input v-bind="{ ...$attrs, required, id }" :value="modelValue" @input="
      emit('update:modelValue', ($event.target as HTMLInputElement).value)
      " @invalid.prevent="onInvalid" @change="onInvalid" ref="input"
      class="h-11 w-full rounded-lg border border-gray-200 py-2 text-gray-500 focus:outline-gray-300"
      :disabled="disabled" />
    <div class="absolute left-0 top-6 h-11 w-fit" ref="prepend">
      <slot name="prepend"></slot>
    </div>
    <div class="absolute right-0 top-6 h-11 w-fit" ref="append">
      <slot name="append"></slot>
    </div>
    <InputError :error="error" />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import InputError from './input-error.vue'
import Icon from '../ui/icon.vue'

// defines
defineProps<{
  modelValue: unknown
  id: string
  label?: string
  required?: boolean
  tooltip?: string
  disabled?: boolean
}>()
const emit = defineEmits(['update:modelValue', 'error'])

// refs
const error = ref()
const append = ref<HTMLElement>()
const prepend = ref<HTMLElement>()
const input = ref<HTMLElement>()

// methods
const onInvalid = (e) => (error.value = validateInput(e))

// watchers
watchEffect(() => {
  emit('error', error.value)
})
watchEffect(() => {
  if (!input.value) return
  if (append.value) {
    const rect = append.value.getBoundingClientRect()
    input.value.style.paddingRight = `${rect.width + 8}px`
  }
  if (prepend.value) {
    const rect = prepend.value.getBoundingClientRect()
    input.value.style.paddingLeft = `${rect.width + 8}px`
  }
})
</script>
