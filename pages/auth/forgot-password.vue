<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <Title>Forgot Password · Zari</Title>
    <div
      class="mx-auto flex min-w-xs flex-col items-center justify-center space-y-6 rounded-xl bg-white py-8 md:min-w-md"
    >
      <img src="/images/logo.png" class="h-16" />
      <h4 class="text-xl font-bold text-gray-500">Forgot Password</h4>
      <form
        class="flex w-full flex-col space-y-6 px-6 md:px-14"
        @submit.prevent="handleSubmit"
      >
        <VInput
          v-model="username"
          id="email"
          label="Email Address"
          placeholder="youremail@alatu.com"
          required
          type="email"
        />
        <Btn class="Btn" v-bind="{ loading }">Reset Code</Btn>
        <NuxtLink
          to="/auth/login"
          class="w-full text-center text-xs font-semibold text-primary"
          >&larr; Back to login</NuxtLink
        >
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import VInput from '~~/components/input/v-input.vue'
import Btn from '~~/components/input/btn.vue'

// defines
definePageMeta({ middleware: ['guest'] })

// refs
const username = ref('')
const loading = ref('')
const router = useRouter()
const { addToast } = useToast()

// methods
const handleSubmit = async () => {
  try {
    loading.value = 'Sending Reset Code...'
    await apiFetch('password/send-auth-code', {
      method: 'post',
      body: {
        username: username.value,
        type: 'password_reset',
        linkOrCode: 'link'
      }
    })
    addToast({ message: 'a reset password code has been sent to their email.' })
    router.replace('/')
  } catch (error) {
  } finally {
    loading.value = ''
  }
}
</script>
