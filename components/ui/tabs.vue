<template>
  <div class="flex items-center justify-between">
    <ul class="flex">
      <div class="contents" v-for="(tab, i) in visibleTabs">
        <RouterLink v-if="tab.path" :to="tab.path" v-slot="{ isExactActive }">
          <NuxtLink :to="tab.path">
            <Tab v-bind="{ tab, isActive: isExactActive }" @updateWidth="(width) => updateWidths(width, i)" />
          </NuxtLink>
        </RouterLink>
        <Tab v-else v-bind="{ tab, isActive: tab.key === activeTab }"
          @updateWidth="(width) => updateWidths(width, i)" />
      </div>
    </ul>
    <DropDown v-if="hiddenTabs.length > 0" :items="hiddenTabs">
      <Icon name="dots-horizontal" class="mx-3 h-5 w-5 cursor-pointer text-gray-400" />
    </DropDown>
  </div>
</template>

<script setup lang="ts">
import { KeySelect, NavItem } from '~~/composables/ui'
import Tab from './tab.vue'
import DropDown from './drop-down.vue'
import Icon from './icon.vue'

// defines
const props = defineProps<{
  tabs: NavItem[]
  activeTab?: KeySelect<NavItem>
  collapse?: boolean
  widthOffset?: number
}>()

// refs
const visibleTabs = ref(props.tabs)
const hiddenTabs = ref<NavItem[]>([])
const tabWidths = reactive<Record<number, number>>({})
const windowSize = useWindowSize()

// methods
const updateWidths = (width: number, index: number) =>
  (tabWidths[index] = width)

// watchers
watchEffect(() => {
  let i = 0
  while (tabWidths[i]) {
    const width = tabWidths[i] ?? 0
    const limit = width > 768 ? 200 : 100
    const widthOffset = props.widthOffset ?? 0
    if (width + limit + widthOffset > windowSize.width && props.collapse) {
      visibleTabs.value = props.tabs.slice(0, i - 1)
      hiddenTabs.value = props.tabs.slice(i - 1)
      break
    }
    i++
  }
})
</script>
