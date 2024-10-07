<template>
  <ViewUser
    v-bind="{ id: $route.params.adminId, page: '/users/admin' }"
    @loaded="onLoad"
  />
</template>

<script setup lang="ts">
import ViewUser from '~~/components/resources/people/view-user.vue'
import { User } from '~~/composables/resources/people'

// methods
const onLoad = (v: User) => (useState('/users/vendor/modalTitle').value = v?.name)
</script>
