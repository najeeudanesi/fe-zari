<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <Title>Login · Zari</Title>
    <div
      class="mx-auto flex min-w-xs flex-col items-center justify-center space-y-6 rounded-xl bg-white py-8 md:min-w-md"
    >
      <img src="/images/logo.png" class="h-16" />
      <h4 class="text-xl font-bold text-gray-500">Login</h4>
      <form
        class="flex w-full flex-col space-y-6 px-6 md:px-14"
        @submit.prevent="handleSubmit"
      >
        <VInput
          v-model="credentials.username"
          id="email"
          label="Email Address"
          placeholder="youremail@alatu.com"
          type="email"
          required
        />
        <VInput
          v-model="credentials.password"
          id="password"
          label="Password"
          placeholder="********"
          :type="credentials.hidePassword ? 'password' : 'text'"
          required
        >
          <template #append>
            <button
              type="button"
              class="flex h-full items-center pr-3"
              :title="
                credentials.hidePassword ? 'Show password' : 'Hide Password'
              "
              @click="credentials.hidePassword = !credentials.hidePassword"
            >
              <Icon
                v-if="credentials.hidePassword"
                name="eye"
                class="h-6 w-6"
              />
              <Icon v-else name="eye-slash" class="h-6 w-6" />
            </button>
          </template>
        </VInput>
        <Btn v-bind="{ loading }">Login</Btn>
        <NuxtLink
          to="/auth/forgot-password"
          class="w-full text-center text-xs font-semibold text-primary"
        >
          Forgot password?
        </NuxtLink>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import VInput from '~~/components/input/v-input.vue'
import { Auth } from '~~/composables/resources/auth'
import Btn from '~~/components/input/btn.vue'
import { FetchError } from 'ohmyfetch'
import Icon from '~~/components/ui/icon.vue'

// defines
definePageMeta({ middleware: ['guest'] })

// refs
const credentials = reactive({ username: '', password: '', hidePassword: true })
const router = useRouter()
const loading = ref('')

// methods
const { addToast } = useToast()
const handleSubmit = async () => {
  try {
    loading.value = 'Login in...'
    await (useAuth().value = apiFetch<Auth>('auth/login', {
      method: 'post',
      body: { ...credentials, relations: userRelations }
    }))
    addToast({
      type: 'success',
      message: 'Welcome to Zari',
      details: 'Login successful'
    })
    router.replace('/')
  } catch (error) {
    if (error instanceof FetchError) {
      addToast({
        type: 'error',
        message: 'Invalid login credentials',
        details: 'Check username/password and try again'
      })
    }
  } finally {
    loading.value = ''
  }
}
</script>
