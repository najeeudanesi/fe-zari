<template>
  <div class="pb-3" v-if="total > perPage">
    <div
      class="mb-3 flex w-full items-center justify-between rounded-lg border-gray-200 bg-white px-4 py-3 sm:px-6"
    >
      <div class="flex flex-1 justify-between md:hidden">
        <div>
          <button
            v-if="currentPage > 1"
            @click="skip(-1)"
            class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
        </div>

        <button
          v-if="currentPage < lastPage"
          @click="skip(1)"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div class="hidden md:flex md:flex-1 md:items-center md:justify-between">
        <div class="flex items-center">
          <p class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ pageStart }}</span> to
            <span class="font-medium">{{ pageEnd }}</span> of
            <span class="font-medium">{{ total }}</span> results
          </p>
          <form
            @submit.prevent="
              emit('paginate', { page: currentPage, perPage: customPerPage })
            "
          >
            <input
              v-model="customPerPage"
              type="number"
              class="ml-8 h-10 w-12 bg-primary-alt text-center text-sm focus:outline-none"
              required
              min="{1}"
              :max="Math.floor(props.total / props.currentPage)"
              title="Edit and press enter"
            />
          </form>
        </div>
        <div>
          <nav
            class="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              @click="skip(-1)"
              :disabled="currentPage <= 1"
              :class="`${
                currentPage <= 1
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'text-gray-500 hover:bg-gray-50'
              } relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium`"
            >
              <span class="sr-only">Previous</span>
              <Icon name="chevron-left" class="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              @click="emit('paginate', { page: 1, perPage })"
              aria-current="page"
              :class="`${
                1 === currentPage
                  ? 'z-10 border-primary bg-primary-alt text-primary'
                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
              } relative inline-flex items-center border px-4 py-2 text-sm font-medium`"
            >
              1
            </button>
            <span
              v-if="currentPage - (currentPage === lastPage ? 4 : 3) > 1"
              class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
            >
              ...
            </span>
            <button
              v-for="pageNumber in pageNumbers"
              @click="emit('paginate', { page: pageNumber, perPage })"
              aria-current="page"
              :class="`${
                pageNumber === currentPage
                  ? 'z-10 border-primary bg-primary-alt text-primary'
                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
              } relative inline-flex items-center border px-4 py-2 text-sm font-medium`"
            >
              {{ pageNumber }}
            </button>
            <span
              v-if="currentPage + (currentPage === 1 ? 4 : 3) < lastPage"
              class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
            >
              ...
            </span>

            <button
              @click="emit('paginate', { page: lastPage, perPage })"
              v-if="lastPage > 1"
              aria-current="page"
              :class="`${
                lastPage === currentPage
                  ? 'z-10 border-primary bg-primary-alt text-primary'
                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
              } relative inline-flex items-center border px-4 py-2 text-sm font-medium`"
            >
              {{ lastPage }}
            </button>

            <button
              @click="skip(1)"
              :disabled="currentPage >= lastPage"
              :class="`${
                currentPage >= lastPage
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'text-gray-500 hover:bg-gray-50'
              } relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium`"
            >
              <span class="sr-only">Next</span>
              <Icon name="chevron-right" class="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '../ui/icon.vue'

// defines
const props = defineProps<{
  currentPage: 1
  firstPage: 1
  firstPageUrl: string
  lastPage: number
  lastPageUrl: string
  nextPageUrl: string | null
  perPage: number
  previousPageUrl: string | null
  total: number
}>()
const emit =
  defineEmits<
    (e: 'paginate', pagination: { page: number; perPage: number }) => void
  >()

// refs
const pageStart = computed(() => (props.currentPage - 1) * props.perPage + 1)
const pageEnd = computed(() =>
  props.lastPage > props.currentPage
    ? props.perPage * props.currentPage
    : props.total
)
const pageNumbers = computed(() => {
  const pageNumbers: number[] = []
  const from =
    props.currentPage - (props.currentPage === props.lastPage ? 3 : 2)
  const to = props.currentPage + (props.currentPage === 1 ? 3 : 2)
  for (let i = from; i <= to; i++) {
    if (i > 1 && i < props.lastPage) {
      pageNumbers.push(i)
    }
  }
  return pageNumbers
})
const customPerPage = ref(props.perPage)

// methods
const skip = (pages: number) => {
  let newPage = props.currentPage + pages
  newPage = newPage > 0 ? newPage : 1
  if (newPage <= props.lastPage && newPage > 0)
    emit('paginate', { page: newPage, perPage: props.perPage })
}
</script>
