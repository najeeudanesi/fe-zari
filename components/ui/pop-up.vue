<template>
  <TransitionRoot appear :show="open" as="template">
    <Dialog as="div" @close="autoClose" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <DialogOverlay class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-md transform space-y-4 overflow-hidden rounded-2xl bg-white py-6 px-4 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-center text-lg font-medium leading-6 text-gray-900">
                <slot name="title">{{ title }}</slot>
              </DialogTitle>
              <div class="flex justify-center text-center">
                <slot>
                  <p class="text-sm text-gray-500">
                    {{ description }}
                  </p>
                </slot>



              </div>

              <div class="modal-body">
                <slot name="content"></slot>
              </div>


              <div class="flex items-center justify-center space-x-6 pt-2">
                <slot name="buttons">
                  <button class="w-16" v-for="button in buttons || []" type="button" :class="[
    button.alt ? 'Btn__alt' : 'Btn',
    button.loading ? 'cursor-progress opacity-50' : ''
  ]" :disabled="button.loading" @click="button.handler">
                    {{ button.text }}
                  </button>
                </slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogOverlay,
  DialogTitle
} from '@headlessui/vue'
export type PopUpButton = {
  text: string
  handler: () => void
  loading?: boolean
  alt?: boolean
}

// defines
const props = defineProps<{
  open: boolean
  title: string
  description: string
  staticBackDrop?: boolean
  buttons?: PopUpButton[]
}>()
const emit = defineEmits(['open', 'close', 'confirm'])

// methods
const autoClose = () => {
  if (props.staticBackDrop === true) return
  emit('close')
}
</script>
