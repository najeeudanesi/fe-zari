<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <Title>Set Password · Zari</Title>
    <div
              class="mx-auto flex min-w-xs flex-col items-center justify-center space-y-6 rounded-xl bg-white py-8 md:min-w-md">
              <img src="/images/logo.png" class="h-16" />
              <h4 class="text-xl font-bold text-gray-500">Set Password</h4>
              <form class="flex w-full flex-col space-y-6 px-6 md:px-14" @submit.prevent="handleSubmit">
                <VInput v-model="credentials.password" id="password" label="Password" placeholder="********"
                  :type="credentials.hidePassword ? 'password' : 'text'" required>
                  <template #append>
                    <button type="button" class="flex h-full items-center pr-3" :title="credentials.hidePassword ? 'Show password' : 'Hide Password'
                      " @click="credentials.hidePassword = !credentials.hidePassword">
                      <Icon v-if="credentials.hidePassword" name="eye" class="h-6 w-6" />
                      <Icon v-else name="eye-slash" class="h-6 w-6" />
                    </button>
                  </template>
                </VInput>
                <VInput v-model="credentials.cPassword" id="cPassword" label="Confirm Password" placeholder="********"
                  :type="credentials.hideCPassword ? 'password' : 'text'" title="Must be the same as password"
                  :pattern="credentials.password" required>
                  <template #append>
                    <button type="button" class="flex h-full items-center pr-3" :title="credentials.hideCPassword ? 'Show password' : 'Hide Password'
                      " @click="credentials.hideCPassword = !credentials.hideCPassword">
                      <Icon v-if="credentials.hideCPassword" name="eye" class="h-6 w-6" />
                      <Icon v-else name="eye-slash" class="h-6 w-6" />
                    </button>
                  </template>
                </VInput>
              <Btn>Set Password</Btn>
            <NuxtLink to="/auth/login" class="w-full text-center text-xs font-semibold text-primary">
          &larr; Back to login
        </NuxtLink>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">

import VInput from '~~/components/input/v-input.vue'
import Btn from '~~/components/input/btn.vue'
import { Auth } from '~~/composables/resources/auth'
import Icon from '~~/components/ui/icon.vue'

// defines
definePageMeta({ middleware: ['guest'] })

// refs
const credentials = reactive({ password: '', cPassword: '', hidePassword: true, hideCPassword: true })
const router = useRouter()
const code = useRoute().params.code
const loading = ref('')

// methods
const handleSubmit = async () => {
  try {
    loading.value = 'Setting password...'
    await (useAuth().value = apiFetch<Auth>('password/verify-and-reset', {
      method: 'post',
      body: { ...credentials, code, relations: userRelations }
    }))
    router.replace('/')
  } catch (error) {
  } finally {
    loading.value = ''
  }
}
</script>

