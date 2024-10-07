<template>
  <div class="flex flex-col space-y-2">
    <div class="flex items-center text-xs">
      {{ label }}
      <span v-if="required" class="ml-1 text-red-500">*</span>
    </div>
    <label class="relative cursor-pointer">
      <slot v-bind="{ fileUrl }"></slot>
      <input
        v-bind="{ ...$attrs, required }"
        type="file"
        class="hidden"
        @input="handleInput"
        @invalid.prevent="onInvalid"
        @change="onInvalid"
        ref="input"
      />
    </label>
    <InputError :error="error" />
  </div>
</template>

<script setup lang="ts">
import InputError from './input-error.vue'

// defines
const props = defineProps<{
  label: string
  modelValue?: { file?: any; fileUrl: string }
  required?: boolean
}>()
const emit = defineEmits(['update:modelValue', 'error'])

// refs
const fileUrl = ref(props.modelValue?.fileUrl)
const input = ref()
const error = ref()

// methods
const handleInput = (e: InputEvent) => {
  const currentTarget = e.currentTarget as HTMLInputElement
  const file = currentTarget.files && currentTarget.files[0]
  if (!file) return
  fileUrl.value = URL.createObjectURL(file)
  emit('update:modelValue', { file, fileUrl: fileUrl.value })
  input.value.value = null
}
const onInvalid = (e) => (error.value = validateInput(e))

// watchers
watchEffect(() => {
  emit('error', error.value)
})
</script>
