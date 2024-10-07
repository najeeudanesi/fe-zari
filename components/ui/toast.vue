<template>
  <output
    role="status"
    :class="`relative mb-3 flex min-h-14 max-w-sm items-center rounded-lg px-4 py-2 shadow-lg
        Toast--${toast.type}`"
  >
    <Surrounder @mouseenter="showX = !showX" />
    <button
      @click="removeToast(toast)"
      :class="`pointer-events-auto absolute -right-2 -top-2 cursor-pointer rounded-full border bg-white 
          ${showX ? 'flex' : 'lg:hidden'} Toast__close--${toast.type}`"
    >
      <Icon
        name="x"
        :class="`h-3 w-3 Toast__icon--${toast.type}`"
        aria-hidden="true"
      />
    </button>
    <Icon
      :name="iconMap[toast.type]"
      :class="`h-7 w-7 Toast__icon--${toast.type}`"
    />
    <div className="pointer-events-none mx-4 flex max-w-sm flex-col">
      <span className="pointer-events-none text-sm font-semibold text-gray-500">
        {{ toast.message }}
      </span>
      <p className="pointer-events-none break-words text-xs text-gray-400">
        {{ toast.details }}
      </p>
    </div>
  </output>
</template>

<script setup lang="ts">
import { Toast } from '~~/composables/ui'
import Surrounder from './surrounder.vue'
import Icon from './icon.vue'

// defines
const props = defineProps<{ toast: Toast }>()

// refs
const showX = ref(false)
const { removeToast } = useToast()
const iconMap = {
  error: 'x-circle-fill',
  success: 'check-circle',
  info: 'info-circle',
  warning: 'exclamation'
}

watchEffect(() => {
  const timeout = setTimeout(() => {
    removeToast(props.toast)
  }, props.toast.timeout * 1000)
  return () => clearTimeout(timeout)
})
</script>
