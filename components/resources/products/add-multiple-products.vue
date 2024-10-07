<template>
    <div class="p-6 flex flex-col space-y-4 w-full">
        <p>Upload your bulk product file here:</p>
        <div class="relative w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
            <Btn class="Btn w-full flex justify-center gap-4" @click="triggerFileUpload"
                :loading="loading ? 'submitting...' : ''">
                <Icon name="upload" class="h-5 w-5" /> Bulk Product Doc
            </Btn>
            <input type="file" ref="fileInput" @change="handleFileUpload"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>
        <div class="flex gap-1">
            <p>Download bulk creation template</p>
            <a :href="templateUrl" class="text-primary cursor-pointer" download>
                here
            </a>
            <p>.</p>
        </div>

        <div class="text-primary">
            <p class="text-xl font-bold">Step-by-Step Guide for Uploading Products</p>
        </div>
        <div>
            <p class="text-gray-500 text-sm">
                1. Download the sample spreadsheet: Start by downloading the sample
                spreadsheet provided here. This spreadsheet will serve as a template for
                organizing your product data.
            </p>

            <p class="text-gray-500 text-sm mt-6">
                2. Prepare your product unit list: Ensure you have a complete list of
                product units ready for upload. For a reference guide on common product
                units, please consult the list provided here.
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Btn from '~~/components/input/btn.vue';
import Icon from '~~/components/ui/icon.vue';

const { addToast } = useToast()
const fileInput = ref<HTMLInputElement | null>(null);
const emit = defineEmits(['close', 'submit']);
const loading = ref(false);

const triggerFileUpload = () => {
    fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        const file = input.files[0];
        console.log('File selected:', file.name);
        await uploadFile(file);
    }
};

const uploadFile = async (file: File) => {
    loading.value = true
    const formData = new FormData();
    formData.append('excel', file);

    try {
        const response = await apiFetch('/products/upload', {
            method: 'POST',
            body: formData
        });

        const res = response
        console.log(res)

        if (response?.data?.success?.length > 0)
            addToast({ message: 'Products added successfully:', type: 'success' });

        else {

            addToast({ message: res?.data?.failed[0]?.reason || "Failed", type: 'error' })
            loading.value = false
            return
        }

        emit('submit');
        emit('close');
    } catch (error) {
        console.error('Error uploading file:', error);
        addToast({ message: error || 'Error uploading file:', type: 'error' });
        loading.value = false
    }


};

const templateUrl = '/docs/Multiple-product-upload-template.xlsx';
</script>
