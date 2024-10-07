import {
  computePosition,
  Placement,
  Middleware,
  flip,
  shift,
  autoUpdate
} from '@floating-ui/dom'

export const useFloating = (placement?: Placement) => {
  // refs
  const reference = ref<HTMLElement>()
  const floating = ref<HTMLElement>()
  const cleanup = ref<() => void>()
  const middleware: Middleware[] = [flip(), shift()]

  // hooks
  onBeforeUnmount(() => cleanup.value?.())

  // watchers
  watchEffect(async () => {
    if (!reference.value || !floating.value) return cleanup.value?.()
    cleanup.value = autoUpdate(reference.value, floating.value, async () => {
      if (!reference.value || !floating.value) return
      const result = await computePosition(reference.value, floating.value, {
        middleware,
        placement
      })
      const { x = 0, y = 0, strategy } = result
      Object.assign(floating.value.style, {
        position: strategy,
        left: `${x}px`,
        top: `${y}px`
      })
    })
  })
  return [reference, floating]
}
