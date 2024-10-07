<template>
  <Transition name="page">
    <div
      class="relative flex h-full flex-col space-y-7 px-5 text-sm sm:px-14"
      v-if="!pending || data"
    >
      <div
        class="flex flex-col space-y-2"
        v-for="{ title, details } in userData.filter((d) => d.details)"
      >
        <span class="text-gray-500">{{ title }}</span>
        <span>{{ details }}</span>
      </div>
      <div v-if="user?.status === 'pending'" class="Modal__footer">
        <Btn class="w-full" :loading="sending" @click="resendInvite">
          Resend Invite
        </Btn>
      </div>
    </div>
    <DetailSkeleton v-else :rows="10" />
  </Transition>
</template>

<script setup lang="ts">
import { ApiShow } from '~~/composables/fetch'
import { User } from '~~/composables/resources/people'
import Btn from '~~/components/input/btn.vue'
import DetailSkeleton from '../detail-skeleton.vue'

// defines
const props = defineProps<{ id: unknown; page: string }>()
const emit = defineEmits(['loaded'])

// refs
const { data, pending } = useApiFetch<ApiShow<User>>(
  `users/${props.id}`,
  () => ({
    params: { 'relations[]': ['roles', 'stores'] },
    group: props.page
  })
)
const user = computed(() => data.value?.data)
const userData = computed<{ title: string; details: string | undefined }[]>(
  () =>
    user.value
      ? [
          { title: 'Username', details: user.value.username },
          { title: 'First Name', details: user.value.name.split(' ')[0] },
          { title: 'Last Name', details: user.value.name.split(' ')[1] },
          { title: 'Email Address', details: user.value.email },
          { title: 'Phone Number', details: user.value.phone },
          {
            title: 'Role',
            details: user.value.roles?.map((r) => r.name ?? r.group).join(', ')
          },
          {
            title: 'Store',
            details: user.value.stores?.map((s) => s.name).join(', ')
          },
          { title: 'Date of Birth', details: '' },
          { title: 'Sex', details: '' },
          { title: 'Religion', details: '' }
        ]
      : []
)
const sending = ref('')

// methods
const { addToast } = useToast()
const resendInvite = async () => {
  sending.value = 'Sending Invite...'
  try {
    await apiFetch('password/send-auth-code', {
      method: 'post',
      body: {
        username:
          user.value?.username || user.value?.email || user.value?.phone,
        type: 'user_invite'
      }
    })
    addToast({
      type: 'success',
      message: 'Invite sent',
      details: `${user.value?.name} will recieve an invite link via email`
    })
  } catch (error) {
  } finally {
    sending.value = ''
  }
}

// watchers
watchEffect(() => user.value && emit('loaded', user.value))
</script>
