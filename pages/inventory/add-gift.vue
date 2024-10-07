<template>
  <div class="contents">
    <Suspense>
      <GiftForm @submit="handleSubmit" v-bind="{ submitting }" />
      <template #fallback> <Fallback /> </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import GiftForm, {
  GiftForm as GiftFormT
} from '~~/components/resources/gift/gift-form.vue'
import Fallback from '~~/components/ui/fallback.vue'

// refs
const submitting = ref(false)
const router = useRouter()

// methods
const handleSubmit = async (gift: GiftFormT) => {
  try {
    submitting.value = true
    await apiFetch('gifts', {
      method: 'post',
      body: toFormData({ ...gift, image: gift.image.file })
    })
    refreshGroups(['inventory'])
    router.push('/inventory')
  } catch (error) {
  } finally {
    submitting.value = false
  }
}
</script>
