<template>
  <div class="flex flex-col rounded-xl bg-white shadow-sm">
    <div class="flex min-h-20 w-full items-center justify-between border-b">
      <div class="p-4"><slot name="header"></slot></div>
      <slot name="opener" v-bind="{ open, setOpen }">
        <button
          @click="open = !open"
          class="flex h-full w-14 items-center justify-center border-l"
        >
          <Icon
            name="chevron-down"
            :class="['h-4 text-gray-500', open ? 'rotate-180' : '']"
          />
        </button>
      </slot>
    </div>
    <Transition
      enterActiveClass="duration-500 ease-out"
      enterFromClass="max-h-0 scale-y-0"
      enterToClass="max-h-full scale-y-100"
      leaveActiveClass="duration-300 ease-in"
      leaveFromClass="max-h-full scale-y-100"
      leaveToClass="max-h-0 scale-y-0"
    >
      <div
        v-if="open"
        class="flex h-fit w-full flex-col space-y-4 rounded-b-xl p-4 text-sm"
      >
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import Icon from '../ui/icon.vue'

// defines
const props = defineProps<{ index: number }>()

// refs
const open = ref(props.index === 0)

// methods
const setOpen = (v: boolean) => (open.value = v)
</script>
