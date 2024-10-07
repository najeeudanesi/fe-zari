<template>
  <TransitionRoot appear :show="open" as="template">
    <Dialog as="div" @close="autoClose" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
      </TransitionChild>

      <TransitionChild as="template" v-bind="transition">
        <DialogPanel :class="[
    'fixed flex h-screen transform flex-col space-y-2 overflow-auto bg-white shadow-xl transition-all',
    position
  ]">
          <DialogTitle as="div" class="flex flex-col p-6 pl-5 text-gray-900 sm:pl-14">
            <div class="flex justify-end text-gray-600">
              <button @click="emit('close')" class="focus:outline-none">
                <Icon name="x" class="h-4 w-4" />
              </button>
            </div>
            <div class="flex justify-between">
              <slot name="title">
                <div>
                  <div class="contents" v-if="title">
                    <h3 class="text-xl font-semibold tracking-wide">
                      {{ title }}
                    </h3>

                    <div class="mt-2" v-if="description">
                      <p class="text-md text-gray-500">
                        {{ description }}
                      </p>
                    </div>
                    <Title>{{ title }} · Zari</Title>
                  </div>
                </div>
              </slot>
              <div class="pt-3 pr-2">
                <slot name="switchable"></slot>
              </div>

            </div>

          </DialogTitle>
          <DialogDescription as="div" class="h-full">
            <slot>


              <div class="mt-4" v-if="buttonText">
                <button type="button" class="Btn" @click="emit('confirm')">
                  {{ buttonText }}
                </button>
              </div>
            </slot>
            <div class="modal-body">
              <slot name="content"></slot>
            </div>
          </DialogDescription>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription
} from '@headlessui/vue'
import Icon from './icon.vue'

// defines
const props = defineProps<{
  open: boolean
  title?: string
  description?: string
  buttonText?: string
  staticBackDrop?: boolean
  slideFrom?: 'right' | 'left' | 'bottom' | 'rightLg'
}>()
const emit = defineEmits(['open', 'close', 'confirm'])

// refs
const transitionMap = {
  right: {
    enterFrom: 'translate-x-full',
    enterTo: 'translate-x-0',
    leaveFrom: 'translate-x-0',
    leaveTo: 'translate-x-full'
  },
  rightLg: {
    enterFrom: 'translate-x-full',
    enterTo: 'translate-x-0',
    leaveFrom: 'translate-x-0',
    leaveTo: 'translate-x-full'
  },
  left: {
    enterFrom: '-translate-x-full',
    enterTo: 'translate-x-0',
    leaveFrom: 'translate-x-0',
    leaveTo: '-translate-x-full'
  },
  bottom: {
    enterFrom: 'translate-y-full',
    enterTo: 'translate-y-0',
    leaveFrom: 'translate-y-0',
    leaveTo: 'translate-y-full'
  }
}
const transition = {
  enter: 'duration-500 ease-out',
  leave: 'duration-300 ease-in',
  ...transitionMap[props.slideFrom || 'right']
}
const positionMap = {
  right: 'top-0 right-0 w-[90vw] sm:w-[72vw] sm:max-w-[35.375rem] h-screen',
  rightLg: 'top-0 right-0 w-[90vw] sm:w-[72vw] sm:max-w-[65.375rem] h-screen',
  left: 'top-0 left-0 sm:w-[72vw] sm:max-w-[34.375rem] h-screen w-[100vw]',
  bottom: 'bottom-0 left-0 h-[72vh] max-h-[34.375rem] w-screen rounded-t-3xl'
}
const position = positionMap[props.slideFrom || 'right']

// methods
const autoClose = () => {
  if (props.staticBackDrop === true) return
  emit('close')
}
</script>
