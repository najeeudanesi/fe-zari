<template>
  <table class="relative hidden w-full lg:table">
    <thead class="text-sm font-normal text-gray-400">
      <slot name="header"></slot>
    </thead>
    <Transition name="page" mode="out-in">
      <slot v-if="!pending && props.data?.data.length === 0" name="empty">
        <Empty class="absolute top-0 left-0 hidden w-full lg:flex" />
      </slot>
      <tbody v-else-if="!pending && !!data">
        <tr v-for="(row, i) in data?.data" class="mb-4 rounded-xl text-gray-600">
          <slot v-bind="{ row, i }"> </slot>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td class="py-2"></td>
        </tr>
        <tr v-for="_ in fakeRows" class="animate-pulse">
          <td class="TableCell px-0.5 py-1.5">
            <div class="flex h-16 w-full items-center bg-gray-200 text-sm delay-100"></div>
          </td>
          <td v-for="_ in fakeColumns" class="TableCell px-0.5 py-1.5">
            <div class="flex h-16 w-full min-w-4 items-center bg-gray-200 text-sm delay-100"></div>
          </td>
        </tr>
      </tbody>
    </Transition>
  </table>
  <Transition name="page" mode="out-in">
    <slot v-if="!pending && props.data?.data.length === 0" name="empty">
      <Empty class="lg:hidden" />
    </slot>
    <div class="flex w-full flex-col space-y-5 lg:hidden" v-else-if="!pending && !!data">
      <MobileRow v-for="(row, i) in data?.data" :index="i">
        <template #header>
          <slot name="mobileHeader" v-bind="{ row, i }"></slot>
        </template>
        <template #opener="{ open, setOpen }">
          <slot name="mobileOpener" v-bind="{ row, i, open, setOpen }"></slot>
        </template>
        <slot v-bind="{ row, i }"> </slot>
      </MobileRow>
    </div>
    <div v-else class="flex w-full flex-col space-y-5 lg:hidden">
      <div v-for="_ in fakeRows" class="grid w-full grid-cols-6 space-x-1">
        <div class="min-h-20 animate-pulse rounded-l-xl bg-gray-200"></div>
        <div class="col-span-5 flex min-h-20 animate-pulse flex-col rounded-r-xl bg-gray-200 shadow-sm"></div>
      </div>
    </div>
  </Transition>

  <Pagination v-if="data?.meta" v-bind="data.meta" @paginate="(p) => emit('paginate', p)"
    class="flex w-full items-end" />
</template>

<script setup lang="ts">
export type TableRow<T> = { i: number; row: T }
import { ApiList } from '~~/composables/fetch'
import MobileRow from './mobile-row.vue'
import Empty from '../ui/empty.vue'
import Pagination from './pagination.vue'

// defines
const props = defineProps<{
  data: ApiList<any> | null
  pending?: boolean
  skeleton?: { rows: number; columns: number }
}>()
const emit =
  defineEmits<
    (e: 'paginate', pagination: { page: number; perPage: number }) => void
  >()

// refs
const fakeRows = new Array(props.skeleton?.rows ?? 3)
const fakeColumns = new Array(props.skeleton?.columns ?? 4)
</script>
