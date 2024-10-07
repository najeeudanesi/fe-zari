<template>
  <UsersList
    v-bind="{ deleteUser, role: 'admin' }"
    @deleted="deleteUser = undefined"
    @cancel-delete="deleteUser = undefined"
  >
    <template #actions>
      <NuxtLink class="Btn font-medium" to="/users/admin/add-admin">
        <Icon name="plus" class="mr-2 h-4 stroke-2" />
        Add Admin
      </NuxtLink>
    </template>
    <template #userActions="{ user, basePath }">
      <NuxtLink :to="`${basePath}/view/${user.id}`" class="Btn__icon">
        <Icon name="eye" class="h-6 w-6" />
      </NuxtLink>
      <NuxtLink :to="`${basePath}/edit/${user.id}`" class="Btn__icon">
        <Icon name="pencil" class="h-6 w-6" />
      </NuxtLink>
      <button class="Btn__icon" type="button" @click="deleteUser = user">
        <Icon name="trash" class="h-6 w-6" />
      </button>
    </template>
  </UsersList>
</template>

<script setup lang="ts">
import UsersList from '~~/components/resources/people/users-list.vue'
import Icon from '~~/components/ui/icon.vue'
import { User } from '~~/composables/resources/people'

definePageMeta({ layout: 'admin', middleware: ['auth'] })

const deleteUser = ref<User>()
</script>
