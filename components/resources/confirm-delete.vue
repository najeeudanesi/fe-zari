<template>
  <PopUp v-bind="popUp" @close="emit('cancelled')">
    <template #buttons>
      <Btn type="button" class="w-32" @click="doDelete" :loading="deleting">
        Delete
      </Btn>
      <button type="button" class="Btn__alt w-32" @click="emit('cancelled')">
        Cancel
      </button>
    </template>
  </PopUp>
</template>

<script setup lang="ts">
import PopUp from '../ui/pop-up.vue'
import Btn from '../input/btn.vue'

// defines
const props = defineProps<{
  item?: unknown
  name: (item) => string
  deleteFn: (item) => void | Promise<void>
}>()
const emit = defineEmits(['cancelled', 'deleted'])

// refs
const deleting = ref('')
const popUp = computed(() =>
  props.item
    ? {
        open: true,
        title: `Delete ${props.name(props.item)}`,
        description: `Are you sure you want to delete ${props.name(
          props.item
        )}?`
      }
    : {
        open: false,
        title: '',
        description: ''
      }
)

// methods
const { addToast } = useToast()
const doDelete = async () => {
  try {
    deleting.value = 'Deleting...'
    await props.deleteFn(props.item)
    addToast({ type: 'info', message: `Deleted ${props.name(props.item)}` })
    emit('deleted')
  } catch (error) {
  } finally {
    deleting.value = ''
  }
}
</script>
