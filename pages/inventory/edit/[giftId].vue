<template>
  <div class="contents">
    <GiftForm
      v-if="giftForm"
      @cancel="$router.replace('/inventory')"
      @submit="handleSubmit"
      v-bind="{ data: giftForm, submitting }"
    />
    <Fallback v-else />
  </div>
</template>

<script setup lang="ts">
import { ApiShow } from '~~/composables/fetch'
import Fallback from '~~/components/ui/fallback.vue'
import GiftForm, {
  GiftForm as GiftFormT
} from '~~/components/resources/gift/gift-form.vue'
import { Gift } from '~~/composables/resources/gifting'

// refs
const route = useRoute()
const router = useRouter()
const giftForm = ref<GiftFormT>()
const submitting = ref(false)
const giftId = computed(() => route.params.giftId)

// methods
const handleSubmit = async (form: GiftFormT) => {
  submitting.value = true
  try {
    await apiFetch(`gifts/${giftId.value}`, {
      method: 'put',
      body: toFormData({ ...form, image: form.image.file })
    })
    refreshGroups(['inventory'])
    router.push('/inventory')
  } catch (error) {
  } finally {
    submitting.value = false
  }
}

// watchers
watchEffect(async () => {
  if (!giftId.value) return
  const data = await apiFetch<ApiShow<Gift>>(`gifts/${giftId.value}`, {
    params: { 'relations[]': ['image'] }
  })
  const { data: gift } = data
  giftForm.value = {
    ...gift,
    image: { fileUrl: gift.image?.url ?? PLACEHOLDER_IMAGE }
  }
  useState('inventory/modalTitle').value = `Edit ${gift.name}`
})
</script>
