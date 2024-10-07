<template>
  <div class="relative flex h-full flex-col space-y-4 px-5 sm:px-14">
    <div class="flex gap-10 grid-cols-1 sm:grid-cols-2">
      <div class="mb-4 col-span-4">
        <FileInput label="Main Image" id="mainImage" v-model="product.mainImage" v-slot="{ fileUrl }" :required="!product.mainImage.fileUrl ||
          product.mainImage.fileUrl === PLACEHOLDER_IMAGE
          " accept="image/*">
          <div class="relative w-48">
            <div class="absolute bottom-0 right-0 rounded-full bg-gray-100 p-1.5">
              <Icon name="pencil" class="h-3.5 w-3.5" />
            </div>
            <img :src="fileUrl || PLACEHOLDER_IMAGE" alt="Main Image" class="h-48 w-48 rounded-lg object-cover" />
          </div>
        </FileInput>
      </div>

      <!-- Additional Images Upload -->
      <div class="mb-4 col-span-8">
        <label class="block mb-2 text-xs font-medium text-gray-700">Additional Images</label>
        <div class="flex flex-wrap gap-4">
          <FileInput v-for="(image, index) in product.additionalImages" :key="index" :label="'Image ' + (index + 1)"
            :id="'additionalImage' + index" v-model="product.additionalImages[index]" v-slot="{ fileUrl }"
            accept="image/*">
            <div class="relative w-24 h-24">
              <div class="absolute bottom-0 right-0 rounded-full bg-gray-100 p-1.5">
                <Icon name="pencil" class="h-3.5 w-3.5" />
              </div>
              <img :src="fileUrl || PLACEHOLDER_IMAGE" alt="'Additional Image ' + (index + 1)"
                class="h-24 w-24 rounded-lg object-cover" />
            </div>
          </FileInput>
        </div>
      </div>
    </div>


    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <VInput id="productName" label="Product Name" v-model="product.name" required placeholder="Product Name" />
      <div>
        <VSelect id="unit" label="Unit" v-model="product.unit" :options="unitOptions" optionValue="id"
          optionLabel="name" :displayValue="displayValue" :searchValue="displayValue">
        </VSelect>
      </div>
      <div>
        <div>
          <VSelect id="category" label="Category" v-model="product.category" required :options="categoryOptions"
            optionValue="id" optionLabel="name" :displayValue="displayValue" :searchValue="displayValue" />
        </div>
      </div>
      <div>
        <VSelect id="variant" label="Variant" v-model="selectedVariant" required multiple :options="variantOptions"
          optionValue="id" optionLabel="name" :displayValue="displayValue" :searchValue="displayValue">
        </VSelect>
      </div>
    </div>

    <!-- Description Input -->
    <div class="mb-4">
      <VTextArea id="description" label="Description" v-model="product.description"
        placeholder="Enter product description here" rows="4" />
    </div>

    <div v-if="selectedVariant.length > 0">
      <div v-for="variant in selectedVariant" :key="variant.id" class="border p-4 mb-4 flex gap-4">
        <p class="text-xl font-bold">{{ variant.name }}</p>
        <div v-for="value in variant.values" :key="value.id" class="flex justify-start gap-3">
          <div>
            <label :for="'value-' + value.id" class="ml-1">{{
              value.value
            }}</label>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between pt-12">
      <p class="font-bold text-2xl">Stocks</p>
      <div class="flex items-center gap-3 cursor-pointer" @click="addStock">
        <Icon name="plus" class="h-5 w-5 text-white bg-primary rounded-full" />
        <p class="text-primary">Add New</p>
      </div>
    </div>

    <div class="mt-4">
      <div v-for="(stock, sIndex) in product.stocks" :key="sIndex" class="border p-4 mb-4">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-8 mt-4">
          <div v-for="(variant, vIndex) in selectedVariant" :key="vIndex" class="col-span-1">
            <label :for="'variant' + vIndex">{{ variant.name }}</label>
            <select :id="'variant' + vIndex" v-model="stock.variantValueIds[vIndex]" class="select_style">
              <option v-for="value in variant.values" :key="value.id" :value="value.id">
                {{ value.value }}
              </option>
            </select>
          </div>
          <VInput :id="'stockQuantity' + sIndex" label="Quantity" v-model="stock.quantity" placeholder="Quantity"
            type="number" />
          <VInput :id="'stockCostPrice' + sIndex" label="Cost Price" v-model="stock.costPrice" placeholder="Cost Price"
            type="number" />
          <VInput :id="'stockSellingPrice' + sIndex" label="Selling Price" v-model="stock.sellingPrice"
            placeholder="Selling Price" type="number" />

          <div class="flex items-center">
            <div class="mt-5 text-lg h-11 font-bold text-white bg-primary py-2 px-3 rounded-lg">
              %
            </div>
            <VInput id="discount" label="Selling price Discount" v-model="stock.discount" type="number" />
          </div>
          <VInput :id="'stockExpiryDate' + sIndex" label="Expiry Date" v-model="stock.expiryDate"
            placeholder="Expiry Date" type="date" />
          <div>
            <p class="text-gray-700 text-sm">Profit</p>

            <div class="h-11 w-full rounded-lg border border-gray-200 py-2 text-gray-500 focus:outline-gray-300 p-2">
              {{ calculateProfit(stock) }}
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <button class="text-gray-500 hover:text-red-600 focus:outline-none" @click.stop="removeStock(sIndex)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 0c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm4.95 13.536a.75.75 0 0 1 0 1.061.75.75 0 0 1-1.061 0L10 11.06l-3.889 3.537a.75.75 0 0 1-1.06-1.06L8.938 10 5.05 6.464a.75.75 0 0 1 1.06-1.06L10 8.94l3.889-3.536a.75.75 0 0 1 1.06 1.06L11.062 10l3.889 3.536z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="flex items-end justify-end mt-4">
      <div class="flex justify-center sm:gap-32 gap-16">
        <button type="button" class="Btn__alt w-40" @click="emit('close')">
          Cancel
        </button>

        <Btn v-if="isUpdate" class="Btn w-40 disabled:bg-gray-400" @click="updateProduct"
          :loading="loading ? 'Submitting...' : ''" :disabled="!isValidForm || loading">Save
        </Btn>
        <Btn v-else class="Btn w-40 disabled:bg-gray-400" @click="saveProduct" :loading="loading ? 'Submitting...' : ''"
          :disabled="!isValidForm || loading">Save
        </Btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import Icon from '~~/components/ui/icon.vue'
import VInput from '~~/components/input/v-input.vue'
import VSelect from '~~/components/input/v-select.vue'
import VTextArea from '~~/components/input/v-text-area.vue'
import { Category } from '~~/composables/resources/category'
import { ProductUnit, Variant } from '~~/composables/resources/business'
import Btn from '~~/components/input/btn.vue'
import FileInput from '~~/components/input/file-input.vue'

const props = defineProps<{
  submitting?: boolean
  categories: Category[]
  productUnits: ProductUnit[]
  product?: any
  isUpdate?: boolean
}>()

interface Stock {
  quantity: number
  costPrice: number | null
  sellingPrice: number | null
  expiryDate: string
  stockLevelAlert: number | null
  variantValueIds: number[]
  discount: number
}

interface Product {
  name: string | null
  stockLevelAlert: number | null
  quantity: number | null
  unit: ProductUnit
  category: Category
  stocks: Stock[]
}

const product = reactive<any>({
  name: null,
  stockLevelAlert: null,
  description: null,
  quantity: 0,
  unit: { id: 0, name: '', status: '', createdAt: '', updatedAt: '' },
  category: { id: 0, name: '', status: '', createdAt: '', updatedAt: '' },
  stocks: [
    {
      quantity: 0,
      costPrice: null,
      sellingPrice: null,
      expiryDate: '',
      stockLevelAlert: null,
      variantValueIds: [],
      discount: 0
    }
  ],
  mainImage: { fileUrl: '', file: null }, // Main image setup
  additionalImages: Array.from({ length: 5 }, () => ({
    fileUrl: '',
    file: null
  })) // Additional images setup
})

// Images and description refs
const mainImage = ref<File | null>(null)
const additionalImages = ref<{ file: File; url: string }[]>([])

const variantOptions = ref<Variant[]>([])
const selectedVariant = ref<Variant[]>([])
const loading = ref(false)

const emit = defineEmits(['close', 'submit'])
const { addToast } = useToast()

const unitOptions = ref(props.productUnits || [])
const categoryOptions = ref<Category[]>(props.categories || []);


const validationErrors = reactive({
  name: '',
  unit: '',
  category: '',
  stocks: ''
})

const addStock = () => {
  product.stocks.push({
    quantity: 0,
    costPrice: null,
    sellingPrice: null,
    expiryDate: '',
    stockLevelAlert: null,
    variantValueIds: [],
    discount: 0,
    profit: 0
  })
}

const removeStock = (index: number) => {
  product.stocks.splice(index, 1)
}

const saveProduct = async () => {
  if (!isValidForm.value) {
    return
  }

  loading.value = true
  try {
    const payload = {
      name: product.name,
      categoryId: product.category.id,
      unitId: product.unit.id,
      quantity: product.stocks.reduce(
        (total, stock) =>
          total + parseInt(stock.quantity as unknown as string, 10),
        0
      ),
      stocks: product.stocks.map((stock) => ({
        quantity: stock.quantity,
        description: product.description,
        costPrice: stock.costPrice,
        sellingPrice: stock.sellingPrice,
        expiryDate: stock.expiryDate,
        stockLevelAlert: stock.stockLevelAlert,
        variantValueIds: stock.variantValueIds
      }))
    }

    console.log('Payload:', payload)

    const response = await apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('Product added successfully', response)
    addToast({ message: 'Product added successfully', type: 'success' })
    emit('submit')
    emit('close')
  } catch (error) {
    console.error('Unexpected error:', error.data || error)
    addToast({
      message: error.data.message || 'Unexpected error occurred',
      type: 'error'
    })
    loading.value = false
  }

  loading.value = false
}
const updateProduct = async () => {
  if (!isValidForm.value) {
    return
  }

  loading.value = true
  try {
    const payload = {
      id: product.id,
      description: product.description,
      name: product.name,
      categoryId: product.category.id,
      unitId: product.unit.id,
      quantity: product.stocks.reduce(
        (total, stock) =>
          total + parseInt(stock.quantity as unknown as string, 10),
        0
      ),
      stocks: product.stocks.map((stock) => ({
        quantity: stock.quantity,
        costPrice: stock.costPrice,
        sellingPrice: stock.sellingPrice,
        expiryDate: stock.expiryDate,
        stockLevelAlert: stock.stockLevelAlert,
        variantValueIds: stock.variantValueIds
      }))
    }

    console.log('Payload:', payload)

    const response = await apiFetch(`/products/${product.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })


    console.log('Product updated successfully', response)
    addToast({ message: 'Product updated successfully', type: 'success' })

    const data = await response
    const productId = data.data.id; // Get the updated product ID

    // Handle image upload using the productId
    if (mainImage)
      await uploadProductImages(productId);
    emit('submit')
    emit('close')
  } catch (error) {
    console.error('Unexpected error:', error.data || error)
    addToast({
      message: error.data.message || 'Unexpected error occurred',
      type: 'error'
    })
    loading.value = false
  }

  loading.value = false
}


const uploadProductImages = async (productId: number): Promise<void> => {
  const imageUploads: Promise<any>[] = []; // Explicitly declare the array type as Promise<any>[]

  // Add the main logo image
  if (product.mainImage && product.mainImage.file) {
    imageUploads.push(
      apiFetch('media', {
        method: 'POST',
        body: toFormData({
          file: product.mainImage.file,
          key: 'single_product_image',
          entity: 'products',
          refId: productId,
        }),
      })
    );
  }

  // Add additional images
  if (product.additionalImages) {
    product.additionalImages.forEach((image) => {
      if (image && image.file) {
        imageUploads.push(
          apiFetch('media', {
            method: 'POST',
            body: toFormData({
              file: image.file,
              key: 'single_product_image',
              entity: 'products',
              refId: productId,
            }),
          })
        );
      }
    });
  }

  try {
    if (imageUploads.length > 0) {
      await Promise.all(imageUploads); // Wait for all images to be uploaded
      addToast({ message: 'Images uploaded successfully', type: 'success' });
    } else {
      addToast({ message: 'No valid images to upload.', type: 'info' });
    }
  } catch (error) {
    console.error('Error uploading images:', error);
    addToast({ message: 'Error uploading images', type: 'error' });
  }
};


const fetchVariants = async () => {
  try {
    const response = await apiFetch('/variants', {
      method: 'GET'
    })
    variantOptions.value = response
    console.log('Variants fetched:', variantOptions.value)
  } catch (e) {
    console.log(e)
  }
}

// Populate the product fields with the prop data if isUpdate is true
onMounted(() => {
  fetchVariants()
  console.log('props', props.product)

  if (props.isUpdate && props.product) {
    product.id = props.product.id
    product.name = props.product.name || null
    product.unit = props.product.unit || null
    product.category = props.product.category || null
    product.stocks = props.product.stocks.map((stock) => ({
      quantity: stock.quantity || 0,
      costPrice: stock.costPrice || null,
      sellingPrice: stock.sellingPrice || null,
      expiryDate: stock.expiryDate || '',
      stockLevelAlert: stock.stockLevelAlert || null,
      variantValueIds: stock.variantValueIds || [],
      discount: stock.discount || 0
    }))

    // Select the associated variants

    selectedVariant.value = variantOptions.value.filter((variant) =>
      props.product.stocks.some((stock) =>
        stock.variantValueIds.includes(variant.id)
      )
    )
  }
})

const isValidForm = computed(() => {
  return product.name && product.category.id && product.stocks.length > 0
})
const calculateProfit = (stock: Stock) => {
  const costPrice = stock.costPrice || 0
  const sellingPrice = stock.sellingPrice || 0
  const discount = stock.discount || 0

  // Apply discount as a percentage
  const discountedSellingPrice = sellingPrice - sellingPrice * (discount / 100)

  // Return the profit
  return discountedSellingPrice - costPrice
}

const displayValue = (v: any) => v?.name
</script>