<template>
  <VSelect
    v-model="address"
    :displayValue="displayValue"
    :options="suggestions"
    :searchValue="displayValue"
    v-bind="{ ...$attrs, id, label, loading, hideDropdown: true }"
    autocorrect="false"
    :spellcheck="false"
    @search="search"
  />
</template>

<script setup lang="ts">
import VSelect from './v-select.vue'

type Suggestion = google.maps.places.QueryAutocompletePrediction

// defines
const props = defineProps<{
  id: string
  label: string
  modelValue?: Suggestion
}>()
const emit = defineEmits(['input'])

// refs
const loading = ref(false)
const suggestions = ref<Suggestion[]>([])
const address = ref<Suggestion | undefined>(props.modelValue)

// methods
const { searchPlaces } = await useGoogleMap()
const displayValue = (suggestion: Suggestion) => suggestion?.description
const search = async (v) => {
  loading.value = true
  const [results] = await searchPlaces(v)
  loading.value = false
  if (!results) return
  suggestions.value = results
}

// wathers
watch(address, () => emit('input', address.value))
</script>
