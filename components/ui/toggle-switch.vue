<template>
    <label class="flex items-center cursor-pointer">
        <div class="relative">
            <input type="checkbox" class="hidden" :checked="computedChecked" @change="handleChange" />
            <div :class="{ 'bg-primary': computedChecked, 'bg-gray-200': !computedChecked }"
                class="toggle__line w-8 h-4 rounded-full shadow-inner"></div>
            <div :class="{ 'translate-x-full': computedChecked, 'translate-x-0': !computedChecked }"
                class="toggle__dot absolute left-0 top-0 w-5 h-4 bg-white rounded-full shadow transform transition-transform duration-300">
            </div>
        </div>
    </label>
</template>

<script setup lang="ts">


const props = defineProps({
    checked: Boolean,
});

const emits = defineEmits(['update:checked']);

const handleChange = (event: Event) => {
    emits['update:checked']((event.target as HTMLInputElement).checked);
};

const computedChecked = computed(() => props.checked);
</script>

<style scoped>
.toggle__line {
    transition: background-color 0.3s;
}

.toggle__dot {
    transition: transform 0.3s;
}
</style>