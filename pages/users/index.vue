<template>
  <UsersList v-bind="{ role: 'user' }">
    <template #userActions="{ user }">
      <NuxtLink class="Btn__icon" :to="`/users/view/${user.id}`">
        <Icon name="eye" class="h-6 w-6" />
      </NuxtLink>
    </template>
  </UsersList>
</template>

<script setup lang="ts">
import UsersList from '~~/components/resources/people/users-list.vue'
import Icon from '~~/components/ui/icon.vue'

definePageMeta({ layout: 'admin', middleware: ['auth'] })
</script>
