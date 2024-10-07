<template>
  <div class="contents">
    <StoreForm
      v-if="storeForm"
      @cancel="$router.replace('/stores')"
      @submit="handleSubmit"
      v-bind="{ data: storeForm, submitting }"
    />
    <Fallback v-else />
    <div ref="mapRef"></div>
  </div>
</template>

<script setup lang="ts">
import StoreForm from '~/components/resources/stores/store-form.vue'
import { ApiShow } from '~~/composables/fetch'
import {
  Store,
  StoreForm as StoreFormT,
  StoreRequest
} from '~~/composables/resources/business'
import Fallback from '~~/components/ui/fallback.vue'

// refs
const route = useRoute()
const router = useRouter()
const storeRef = ref<Store>()
const storeForm = ref<StoreFormT>()
const { getPlace, mapRef } = useGoogleMap()
const submitting = ref(false)
const storeId = computed(() => route.params.storeId)
const { addToast } = useToast()

// methods
const handleSubmit = async (store: StoreFormT) => {
  const { categories, address, productImages, logo, bankAccount, ...form } =
    store
  const place = address.place_id
    ? await getPlace({
        placeId: address.place_id || '',
        fields: ['formatted_address', 'geometry.location']
      })
    : undefined

  submitting.value = true
  const body: Partial<StoreRequest> = {
    ...form,
    categoryIds: categories.map((c) => c.id),
    address: place && {
      address: place.formatted_address ?? '',
      longitude: place.geometry?.location?.lng(),
      latitude: place.geometry?.location?.lat()
    },
    bankAccount: {
      accountNumber: bankAccount.accountNumber,
      bank: bankAccount.bank?.code ?? ''
    }
  }
  try {
    await apiFetch(`stores/${storeId.value}`, { method: 'put', body })
    await uploadImages(logo, productImages)
    refreshGroups(['stores', `stores/${storeId.value}`])
    router.push('/stores')
    addToast({ type: 'success', message: `Store updated successfully` })
  } catch (error) {
    addToast({ type: 'error', message: `Could not update store` })
  } finally {
    submitting.value = false
  }
}
const uploadImages = async (
  logo: StoreFormT['logo'],
  productImages: StoreFormT['productImages']
) => {
  const apiCalls: Promise<unknown>[] = []

  const fileUrls = new Set<string>()
  productImages.forEach((image) => {
    if (!image.fileUrl.startsWith('blob:')) return fileUrls.add(image.fileUrl)
    apiCalls.push(
      apiFetch('media', {
        method: 'post',
        body: toFormData({
          file: image.file,
          key: 'product_image',
          entity: 'stores',
          refId: storeRef.value!.id
        })
      })
    )
  })
  storeRef.value?.productImages?.forEach((file) => {
    if (fileUrls.has(file.url)) return
    apiCalls.push(
      apiFetch(`media/${file.id}`, {
        method: 'delete'
      })
    )
  })

  if (!logo.file) return await Promise.all(apiCalls)

  if (storeRef.value?.logo) {
    apiCalls.push(
      apiFetch(`media/${storeRef.value?.logo?.id}`, {
        method: 'put',
        body: toFormData({ file: logo.file })
      })
    )
  } else {
    apiCalls.push(
      apiFetch('media', {
        method: 'post',
        body: toFormData({
          file: logo.file,
          key: 'logo',
          entity: 'stores',
          refId: storeRef.value!.id
        })
      })
    )
  }

  await Promise.all(apiCalls)
}

// watchers
watchEffect(async () => {
  if (!storeId.value) return
  const data = await apiFetch<ApiShow<Store>>(`stores/${storeId.value}`, {
    params: {
      'relations[]': [
        'address',
        'bankAccount',
        'categories',
        'vouchers',
        'logo',
        'productImages'
      ]
    }
  })
  const { data: store } = data
  storeForm.value = {
    name: store.name,
    description: store.description,
    categories: store.categories || defaultStore.categories,
    address: store.address
      ? {
          description: store.address.address,
          matched_substrings: [],
          terms: []
        }
      : defaultStore.address,
    bankAccount: store.bankAccount || defaultStore.bankAccount,
    commisionPercentage: store.commisionPercentage,
    vouchers: store.vouchers || defaultStore.vouchers,
    logo: store.logo ? { fileUrl: store.logo?.url } : defaultStore.logo,
    productImages: store.productImages
      ? store.productImages.map((image) => ({
          fileUrl: image.url
        }))
      : defaultStore.productImages
  }
  storeRef.value = store
  useState('stores/modalTitle').value = `Edit ${store.name}`
})
</script>
