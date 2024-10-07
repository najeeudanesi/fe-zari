<template>
    <div class="relative flex w-full flex-col text-sm text-gray-600 mt-4">
        <label v-if="label" :for="id" class="mb-2 flex h-4 items-center text-xs">{{ label }}
            <span v-if="required" class="ml-1 text-red-500">*</span>
            <Icon v-if="tooltip" :title="tooltip" name="question-circle-fill" class="ml-2 h-4 w-4 cursor-pointer" />
        </label>
        <div class="flex flex-wrap items-center gap-2">
            <div v-for="(value, index) in modelValue" :key="index" class="flex items-center bg-gray-200 p-2 rounded">
                <span>{{ value }}</span>
                <button type="button" @click="removeValue(index)" class="ml-2 text-red-500">x</button>
            </div>
        </div>
        <div class="flex items-center">
            <input v-bind="{ ...$attrs, required, id }" :value="newValue" @input="onInput"
                @keydown.enter.prevent="addValue" ref="input"
                class="h-11 w-full rounded-lg border border-gray-200 py-2 text-gray-500 focus:outline-gray-300"
                :disabled="disabled" />
            <button type="button" @click="addValue" class="ml-2 h-11 px-4 rounded-lg bg-primary text-white">+</button>
        </div>
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
import { ref, watchEffect } from 'vue'
import InputError from './input-error.vue'
import Icon from '../ui/icon.vue'

// props and emits
const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    id: String,
    label: String,
    required: Boolean,
    tooltip: String,
    disabled: Boolean
})
const emit = defineEmits(['update:modelValue', 'error'])

// refs
const newValue = ref('')
const error = ref()

// methods
const addValue = () => {
    if (newValue.value && !props.modelValue.includes(newValue.value)) {
        emit('update:modelValue', [...props.modelValue, newValue.value])
        newValue.value = ''
    }
}

const removeValue = (index) => {
    const updatedValues = [...props.modelValue]
    updatedValues.splice(index, 1)
    emit('update:modelValue', updatedValues)
}

const onInput = (event) => {
    newValue.value = event.target.value
}

// watchers
watchEffect(() => {
    emit('error', error.value)
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
