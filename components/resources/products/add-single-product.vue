<template>
    <div class="relative flex h-full flex-col space-y-4 px-5 sm:px-14">
        <!-- Main Image Upload -->
        <div class="flex gap-10 grid-cols-1 sm:grid-cols-2">
            <div class="mb-4 col-span-4">
                <FileInput label="Main Image" id="mainImage" v-model="product.mainImage" v-slot="{ fileUrl }"
                    :required="!product.mainImage.fileUrl || product.mainImage.fileUrl === PLACEHOLDER_IMAGE"
                    accept="image/*">
                    <div class="relative w-48">
                        <div class="absolute bottom-0 right-0 rounded-full bg-gray-100 p-1.5">
                            <Icon name="pencil" class="h-3.5 w-3.5" />
                        </div>
                        <img :src="fileUrl || PLACEHOLDER_IMAGE" alt="Main Image"
                            class="h-48 w-48 rounded-lg object-cover" />
                    </div>
                </FileInput>

            </div>


            <!-- Additional Images Upload -->
            <div class="mb-4 col-span-8">
                <label class="block mb-2 text-xs font-medium text-gray-700">Additional Images</label>
                <div class="flex flex-wrap gap-4">
                    <FileInput v-for="(image, index) in product.additionalImages" :key="index"
                        :label="'Image ' + (index + 1)" :id="'additionalImage' + index"
                        v-model="product.additionalImages[index]" v-slot="{ fileUrl }" accept="image/*">
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
            <VInput id="quantity" label="Quantity" v-model="product.quantity" required placeholder="Quantity"
                type="number" />


            <div>
                <VSelect id="unit" label="Unit" v-model="product.unit" :options="unitOptions" optionValue="id"
                    optionLabel="name" :displayValue="displayValue" :searchValue="displayValue">
                </VSelect>
            </div>

            <div>
                <VSelect id="category" label="Category" v-model="product.category" required :options="categoryOptions"
                    optionValue="id" optionLabel="name" :displayValue="displayValue" :searchValue="displayValue" />
            </div>


        </div>

        <!-- Description Input -->
        <div class="mb-4">
            <VTextArea id="description" label="Description" v-model="product.description"
                placeholder="Enter product description here" rows="4" />
        </div>

        <div class="p-4 outline outline-1 outline-gray-200 rounded-lg">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-2 p-4">
                <VInput id="costPrice" label="Cost Price" v-model="product.costPrice" required type="number" />
                <VInput id="stock" label="Stock Level Alert" v-model="product.stock" required type="number" />
                <div>
                    <label for="expDate" class="text-xs flex gap-1 text-gray-700 mb-3">
                        Exp Date
                    </label>
                    <VueDatePicker v-model="product.expDate" name="expDate" id="expDate" format="d.MM.yy"
                        :time-picker="false" />
                </div>
            </div>


            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 my-2 border-t-2 border-primary p-4">
                <VInput id="sellingPrice" label="Selling Price" v-model="product.sellingPrice" required type="number" />
                <div class="flex items-center">
                    <div class="mt-5 text-lg h-11 font-bold text-white bg-primary py-2 px-3 rounded-lg">
                        %
                    </div>
                    <VInput id="discount" label="Selling price Discount" v-model="product.discount" type="number" />
                </div>
                <VInput id="stock" label="Discounted selling price" v-model="product.discountedPrice" type="number"
                    :disabled="true" />
                <VInput id="profit" label="Profit" v-model="product.profit" type="number" :disabled="true" />
            </div>
        </div>

        <div class="flex justify-center sm:gap-32 gap-16">
            <button @click="emit('close')" type="button" class="Btn__alt w-40">
                Cancel
            </button>
            <Btn v-if="!isUpdate" @click="submitProduct" class="Btn w-40 disabled:bg-gray-400"
                :loading="loading ? 'Submitting...' : ''" :disabled="!isValidForm || loading">
                Save
            </Btn>
            <Btn v-else @click="updateProduct" class="Btn w-40 disabled:bg-gray-400"
                :loading="loading ? 'Updating...' : ''" :disabled="!isValidForm || loading">
                Save
            </Btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import Icon from '~~/components/ui/icon.vue';
import VInput from '~~/components/input/v-input.vue';
import VSelect from '~~/components/input/v-select.vue';
import VTextArea from '~~/components/input/v-text-area.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ProductForm, ProductUnit, Variant } from '~/composables/resources/business';
import { Category } from '~~/composables/resources/category';
import Btn from '~~/components/input/btn.vue';
import FileInput from '~~/components/input/file-input.vue'

// defines
const router = useRouter()
const props = defineProps<{
    data?: ProductForm;
    submitting?: boolean;
    categories?: Category[];
    productUnits: ProductUnit[]
    isUpdate?: boolean
}>();
const emit = defineEmits(['close', 'submit']);
const { addToast } = useToast();
const variantOptions = ref()
// to add variant 

const variantName = ref("");
const variantType = ref("");
// refs


// Images and description refs
const mainImage = ref<File | null>(null);
const additionalImages = ref<{ file: File, url: string }[]>([]);

const product = reactive({
    mainImage: { fileUrl: '', file: null },
    additionalImages: Array(5).fill({ fileUrl: '', file: null }),
    description: '', ...props.data || defaultProduct
});
const loading = ref(false)
// options for v-select
const unitOptions = ref(props.productUnits || [])
const categoryOptions = props.categories || []; // already exists
const variantToggleOptions = [{ id: 1, label: 'No', value: 0 }, { id: 2, label: 'Yes', value: 1 }];
const showVariantForm = ref(false)

const toggleVaraintForm = () => {
    showVariantForm.value = true
}

const closeVariantForm = () => {
    showVariantForm.value = false
}

const calculateDiscountedPrice = () => {
    if (product.sellingPrice && product.discount != null) {
        product.discountedPrice = product.sellingPrice - (product.sellingPrice * product.discount / 100);
    } else {
        product.discountedPrice = product.sellingPrice; // Handle the case where discount is 0
    }
}


const calculateProfit = () => {
    if (product.costPrice && product.discountedPrice) {
        product.profit = product.discountedPrice - product.costPrice;
    } else {
        product.profit = 0
    }
}

// Watchers to auto-calculate discounted price and profit
watch([() => product.sellingPrice, () => product.discount], () => {
    calculateDiscountedPrice();
});

watch([() => product.costPrice, () => product.discountedPrice], () => {
    calculateProfit()
});


const fetchVariants = async () => {
    try {
        const response = await apiFetch('/variants', {
            method: 'GET',
        });

        variantOptions.value = response;
        console.log("variants", variantOptions.value)
    } catch (e) {
        console.log(e);
    }
}


// Handle main image upload
const handleMainImageUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) mainImage.value = file;
};

// Handle additional images upload
const handleAdditionalImagesUpload = (event: Event) => {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
        for (const file of files) {
            const imageUrl = URL.createObjectURL(file);
            additionalImages.value.push({ file, url: imageUrl });
        }
    }
};

// Remove an additional image
const removeAdditionalImage = (index: number) => {
    additionalImages.value.splice(index, 1);
};


const submitProduct = async () => {
    loading.value = true;

    // Build form payload (excluding images for now)
    const payload = {
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        unitId: product.unit.id,
        categoryId: product.category.id,
        costPrice: product.costPrice,
        stock: product.stock,
        expiryDate: product.expDate,
        sellingPrice: product.sellingPrice,
        discount: product.discount,
        discountedPrice: product.discountedPrice,
        profit: product.profit,
        hasVariant: product.hasVariant,
        variantValue: product.hasVariant ? product.variant.name : null,
        variantType: product.hasVariant ? product.variant.type : null,
        stocks: [
            {
                quantity: product.quantity,
                costPrice: product.costPrice,
                sellingPrice: product.sellingPrice,
                expiryDate: product.expDate,
                stockLevelAlert: product.stock,
                variantValueIds: [] // Adjust based on your needs
            }
        ]
    };

    try {
        const response = await apiFetch('/products', {
            method: 'POST',
            body: JSON.stringify(payload), // Send product data (without images)
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response
        const productId = data.data.id; // Get the newly created product ID

        // Handle image upload using the productId
        if (mainImage)
            await uploadProductImages(productId);

        addToast({ message: 'Product added successfully', type: 'success' });
        emit('submit');
        emit('close');
    } catch (error) {
        console.error('Unexpected error:', error);
        addToast({ message: 'Unexpected error occurred', type: 'error' });
    } finally {
        loading.value = false;
    }
};

const updateProduct = async () => {
    loading.value = true;

    const payload = {
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        unitId: product.unit.id,
        categoryId: product.category.id,
        costPrice: product.costPrice,
        stock: product.stock,
        expiryDate: product.expDate,
        sellingPrice: product.sellingPrice,
        discount: product.discount,
        discountedPrice: product.discountedPrice,
        profit: product.profit,
        hasVariant: product.hasVariant,
        variantValue: product.hasVariant ? product.variant.name : null,
        variantType: product.hasVariant ? product.variant.type : null,
        stocks: [
            {
                quantity: product.quantity,
                costPrice: product.costPrice,
                sellingPrice: product.sellingPrice,
                expiryDate: product.expDate,
                stockLevelAlert: product.stock,
                variantValueIds: [] // Adjust based on your needs
            }
        ]
    };
    console.log("payload", payload)

    try {
        const response = await apiFetch(`/products/${product.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload), // Update product without images
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response
        const productId = data.data.id; // Get the updated product ID

        // Handle image upload using the productId
        if (mainImage)
            await uploadProductImages(productId);

        addToast({ message: 'Product updated successfully', type: 'success' });
        emit('submit');
        emit('close');
    } catch (error) {
        console.error('Error updating product:', error);
        addToast({ message: 'Error updating product', type: 'error' });
    } finally {
        loading.value = false;
    }
};
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


const addVariant = async () => {
    const payload = {
        id: 0,
        name: variantName.value,
        // value: variantName.value.split(','),
        value: variantName.value,
        type: variantType.value,
        createdAt: "",
        updatedAt: ""
    }

    console.log(payload);

    try {
        const response = await apiFetch(`/variants`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await fetchVariants()
        addToast({ message: 'Variant added successfully', type: 'success' });
        closeVariantForm()

    } catch (e) {
        console.log(e)
        addToast({ message: e.data.message || 'Error adding variant', type: 'error' });
    }
}



// Computed property to check if the form is valid
const isValidForm = computed(() => {
    return (
        product.name &&
        product.category.id &&
        product.quantity &&
        product.stock &&
        product.sellingPrice
    );
});

const isValidVariantForm = computed(() => {
    return (
        (variantName.value === null || variantName.value === "") ||
        (variantType.value === null || variantType.value === "")
    );
});

const displayValue = (v) => v?.name;

onMounted(calculateDiscountedPrice)
onMounted(calculateProfit)
onMounted(fetchVariants)
</script>
