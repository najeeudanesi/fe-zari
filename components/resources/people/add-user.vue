<template>
  <div class="contents">
    <Suspense>
      <UserForm @submit="handleSubmit" v-bind="{ submitting, role }" />
      <template #fallback> <Fallback /> </template>
    </Suspense>
    <div class="hidden" ref="mapRef"></div>
  </div>
</template>

<script setup lang="ts">
import UserForm, {
  UserForm as UserFormT
} from '~~/components/resources/people/user-form.vue'
import Fallback from '~~/components/ui/fallback.vue'
import { RoleGroup, UserRequest } from '~~/composables/resources/people'

// defines
const props = defineProps<{ role: RoleGroup }>()

// refs
const basePath = props.role === 'user' ? '/users' : `/users/${props.role}`
const submitting = ref(false)
const router = useRouter()
const { addToast } = useToast()

// methods
const handleSubmit = async (admin: UserFormT) => {
  submitting.value = true
  try {
    const body: UserRequest = {
      ...admin,
      username: admin.email,
      roleGroup: props.role,
      storeId: admin.store?.id
    }
    await apiFetch('users/admin', { method: 'post', body })
    refreshGroups([basePath])
    router.push(basePath)
  } catch (error) {
    addToast({ type: 'error', message: 'Email already exist' })
  } finally {
    submitting.value = false
  }
}

// logic
useState(`${basePath}/modalTitle`).value = `Add ${props.role}`
</script>
