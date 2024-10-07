<template>
  <form
    @submit.prevent="submit"
    class="relative flex h-full flex-col space-y-4 px-5 sm:px-14"
  >
    <FileInput
      label="Add Image"
      id="storeLogo"
      v-model="gift.image"
      v-slot="{ fileUrl }"
    >
      <div class="absolute bottom-0 right-0 rounded-full bg-gray-100 p-1.5">
        <Icon name="pencil" class="h-3.5 w-3.5" />
      </div>
      <img :src="fileUrl" alt="sample image" class="h-20 w-20 rounded-lg" />
    </FileInput>
    <VInput id="name" label="Product Name" v-model="gift.name" required />
    <VInput
      id="quantity"
      label="Quantity"
      type="number"
      v-model="gift.quantity"
      required
    />
    <VTextArea
      id="description"
      label="Description"
      v-model="gift.description"
      rows="3"
    />
    <div class="Modal__footer">
      <button
        v-if="data"
        @click="emit('cancel')"
        type="button"
        class="Btn__alt w-40"
      >
        Cancel
      </button>
      <Btn class="w-full" :loading="submitting ? 'Submitting...' : ''">
        Save
      </Btn>
    </div>
  </form>
</template>

<script setup lang="ts">
import VInput from '~~/components/input/v-input.vue'
import VTextArea from '~~/components/input/v-text-area.vue'
import Btn from '~~/components/input/btn.vue'
import { FormFile } from '~~/composables/form'
import Icon from '~~/components/ui/icon.vue'
import FileInput from '~~/components/input/file-input.vue'

export type GiftForm = {
  image: FormFile
  name: string
  description: string
  quantity: number | null
}

// defines
const props = defineProps<{
  data?: GiftForm
  submitting?: boolean
}>()
const emit = defineEmits(['cancel', 'submit'])

// refs
const defaultFrom: GiftForm = {
  name: '',
  description: '',
  quantity: null,
  image: { fileUrl: PLACEHOLDER_IMAGE }
}
const gift = reactive(props.data || { ...defaultFrom })

// methods
const submit = () => emit('submit', gift)
</script>
