<template>
  <div class="contents">
    <UserForm
      v-if="adminForm"
      @cancel="$router.replace(basePath)"
      @submit="handleSubmit"
      v-bind="{ data: adminForm, submitting, role }"
    />
    <Fallback v-else />
  </div>
</template>

<script setup lang="ts">
import UserForm, {
  UserForm as UserFormT
} from '~~/components/resources/people/user-form.vue'
import { ApiShow } from '~~/composables/fetch'
import { RoleGroup, User, UserRequest } from '~~/composables/resources/people'
import Fallback from '~~/components/ui/fallback.vue'

// defines
const props = defineProps<{ role: RoleGroup }>()

// refs
const basePath = props.role === 'user' ? '/users' : `/users/${props.role}`
const route = useRoute()
const router = useRouter()
const adminForm = ref<UserFormT>()
const submitting = ref(false)
const adminId = computed(() => route.params.adminId)

// methods
const { addToast } = useToast()
const handleSubmit = async (form: UserFormT) => {
  submitting.value = true
  const body: Partial<UserRequest> = {
    ...form,
    email: form.email === adminForm.value?.email ? undefined : form.email,
    phone: form.phone === adminForm.value?.phone ? undefined : form.phone,
    storeId: form.store?.id
  }
  try {
    await apiFetch(`users/${adminId.value}`, { method: 'put', body })
    router.push(basePath)
    refreshGroups(['admins', basePath])
  } catch (error) {
    addToast({ type: 'error', message: 'Error updating user' })
  } finally {
    submitting.value = false
  }
}

// watchers
watchEffect(async () => {
  if (!adminId.value) return
  const data = await apiFetch<ApiShow<User>>(`users/${adminId.value}`, {
    params: { 'relations[]': ['roles', 'stores'] }
  })
  const { data: user } = data
  adminForm.value = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    store: user.stores?.[0]
  }
  useState(`${basePath}/modalTitle`).value = `Edit ${user.name}`
})
</script>
