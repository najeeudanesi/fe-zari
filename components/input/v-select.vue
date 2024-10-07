<template>
  <Combobox v-model="selected" @select="emit('select', selected)" v-bind="{ multiple, nullable: true }">
    <div class="relative text-sm">
      <label :for="id" class="mb-2 flex items-center text-xs">{{ label }}
        <span v-if="required" class="ml-1 text-red-500">*</span>
        <Icon v-if="tooltip" :title="tooltip" name="question-circle-fill" class="ml-2 h-4 w-4 cursor-pointer" />
      </label>
      <div class="relative w-full overflow-hidden rounded-lg bg-white text-left text-sm" ref="reference">
        <ComboboxInput
          class="h-11 w-full rounded-lg border border-gray-200 p-2 pr-8 text-gray-500 focus:outline-gray-300"
          v-bind="{ displayValue, required, autocomplete: 'off', ...$attrs }" @change="onChange"
          @invalid.prevent="onInvalid" />
        <ComboboxButton v-if="!hideDropdown" class="absolute inset-y-0 right-0 flex items-center pr-2">
          <TwSpinner v-if="loading" class="mr-4 h-5 w-5 animate-spin text-gray-500" />
          <Icon v-else name="arrow-drop-down" class="h-5 w-5 text-gray-600" aria-hidden="true" />
        </ComboboxButton>
      </div>
      <InputError :error="error" />
      <TransitionRoot leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0"
        @after-leave="query = ''">
        <ComboboxOptions>
          <div ref="floating"
            class="z-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div v-if="filteredOptions.length === 0 && query !== ''"
              class="relative cursor-default select-none py-2 px-4 text-gray-700">
              Nothing found.
            </div>

            <ComboboxOption v-for="option in filteredOptions" as="template" :value="option"
              v-slot="{ selected, active }">
              <li class="relative cursor-default select-none py-2 pl-10 pr-4" :class="{
    'bg-primary-alt text-primary': active,
    'text-gray-600': !active
  }">
                <span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
                  {{ displayValue(option) }}
                </span>
                <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                  <Icon name="check" class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
            <ComboboxOption>
              <slot name="button"></slot>
            </ComboboxOption>
          </div>

        </ComboboxOptions>

      </TransitionRoot>

      <slot></slot>
    </div>

  </Combobox>
</template>

<script setup lang="ts">
export type Option = string | number | boolean | Record<string, any> | undefined
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot
} from '@headlessui/vue'
import Icon from '../ui/icon.vue'
import TwSpinner from '../ui/tw-spinner.vue'
import InputError from './input-error.vue'

// defines
const props = defineProps<{
  modelValue?: Option
  displayValue: (v: Option) => string
  searchValue: (v: Option) => string
  options: Option[]
  id: string
  label: string
  required?: boolean
  tooltip?: string
  loading?: boolean
  multiple?: boolean
  hideDropdown?: boolean
}>()
const emit = defineEmits(['update:modelValue', 'error', 'search', 'select'])

// refs
const [reference, floating] = useFloating()
const selected = ref(props.modelValue)
const query = ref('')
const error = ref()
const filteredOptions = computed(() =>
  query.value === ''
    ? props.options
    : props.options.filter((option) =>
      props
        .searchValue(option)
        .toLowerCase()
        .replace(/\s+/g, '')
        .match(query.value.toLowerCase().replace(/\s+/g, ''))
    )
)

// methods
const onInvalid = (e) => {
  error.value = validateInput(e)
}
const onChange = (e) => {
  query.value = e.target.value
}

// wathers
watchEffect(() => {
  emit('update:modelValue', selected.value)
  emit('error', error.value)
  emit('search', query.value)
})
</script>
