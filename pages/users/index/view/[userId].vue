<template>
  <ViewUser
    v-bind="{ id: $route.params.userId, page: 'users' }"
    @loaded="onLoad"
  />
</template>

<script setup lang="ts">
import ViewUser from '~~/components/resources/people/view-user.vue'
import { User } from '~~/composables/resources/people'

// methods
const onLoad = (v: User) => (useState('/users/modalTitle').value = v?.name)
</script>
