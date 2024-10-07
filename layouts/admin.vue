<template>
  <div class="contents">
    <Title>Zari</Title>
    <header class="top-0 z-10 sm:sticky sm:bg-white sm:shadow-sm">
      <div class="mx-3 flex items-center justify-end py-2 sm:mx-6 sm:h-16 sm:justify-between sm:py-4">
        <NuxtLink to="/" class="hidden sm:inline-block">
          <img src="/images/logo.png" class="h-8" />
        </NuxtLink>
        <div class="flex items-center space-x-4">
          <DropDown :items="profileItems">
            <img :src="PLACEHOLDER_IMAGE" class="h-11 w-11 cursor-pointer rounded-full" alt="sample user" />
          </DropDown>
        </div>
      </div>
    </header>
    <main class="flex">
      <aside
        class="fixed bottom-0 left-0 z-10 w-screen bg-white shadow-lg sm:sticky sm:top-0 sm:z-0 sm:-mt-16 sm:block sm:h-screen sm:w-32 sm:shadow-sm">
        <div
          class="flex items-center py-2 px-4 text-gray-400 sm:mt-16 sm:flex-col sm:items-center sm:align-middle sm:space-y-4 sm:p-4">
          <NuxtLink v-for="nav in navItems" :to="nav.to" :title="nav.title"
            class="btn-transition mx-auto sm:w-24 px-5 py-2 hover:rounded-lg hover:bg-primary-alt hover:text-primary sm:hover:-translate-y-1 sm:hover:scale-105"
            active-class="scale-105 rounded-r-lg bg-primary-alt text-primary hover:rounded-l-none sm:border-l-4 sm:border-l-primary">
            <div class="flex flex-col items-center align-middle">
              <Icon v-if="nav.icon" :name="nav.icon" class="h-6 w-6" />
              <span v-if="nav.title" class="hidden sm:inline text-2xs">{{ nav.title }}</span>
            </div>

          </NuxtLink>
        </div>
      </aside>
      <div class="mb-20 w-screen sm:contents">
        <NuxtPage />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Icon from '~/components/ui/icon.vue'
import DropDown from '~/components/ui/drop-down.vue'
import { NavItem } from '~~/composables/ui'

const auth = await useAuth().value
provide('auth', auth)

const navItems: NavItem[] = [
  { title: 'Store', icon: 'building-storefront', to: '/stores', permission: 'stores.update' },
  { title: 'Transactions', icon: 'credit-card', to: '/transactions', permission: 'purchases.pay_store' },
  { title: 'Vouchers', icon: 'gift', to: '/purchases', permission: userRole() === 'vendor' ? 'purchases.index' : '' },
  { title: 'Messages', icon: 'message', to: '/messages', permission: 'messages.index' },
  { title: 'Users', icon: 'user', to: '/users', permission: 'users.destroy' },
  { title: 'Cart', icon: 'cart', to: '/', permission: 'gifts.index' },
  { title: 'Inventory', icon: 'box', to: '/inventory', permission: 'users.destroy' },
  { title: 'Config', icon: 'settings', to: '/config', permission: 'users.destroy' },
].filter(n => hasPermission(n.permission))

const profileItems: NavItem[] = [
  { title: 'Logout', handler: useLogout, icon: 'logout', loading: false }
]
</script>
