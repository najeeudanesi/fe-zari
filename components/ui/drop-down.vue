<template>
  <Menu as="div" class="flex flex-col items-end">
    <MenuButton
      as="div"
      v-slot="{ open }"
      class="flex items-center"
      v-bind="$attrs"
    >
      <slot v-bind="{ open }"></slot>
    </MenuButton>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems class="relative focus:outline-none">
        <div ref="reference"></div>
        <div
          ref="floating"
          class="z-50 mt-6 w-48 divide-y divide-gray-100 rounded-md bg-white font-semibold shadow-lg"
        >
          <MenuItem as="div" v-for="item in items">
            <NuxtLink v-if="item.to" :to="item.to">
              <DropDownItem :item="item" />
            </NuxtLink>
            <DropDownItem v-else :item="item" @click="() => item.handler?.()" />
          </MenuItem>
        </div>
      </MenuItems>
    </Transition>
  </Menu>
</template>

<script setup lang="ts">
import { Placement } from '@floating-ui/dom'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { NavItem } from '~~/composables/ui'
import DropDownItem from './drop-down-item.vue'

// defines
const props = defineProps<{ items: NavItem[]; placement?: Placement }>()

// refs
const [reference, floating] = useFloating(props.placement || 'left')
</script>
