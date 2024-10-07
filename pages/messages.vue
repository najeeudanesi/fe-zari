<template>
  <div class="flex w-full flex-col space-y-8 px-4 pb-0 sm:p-8">
    <Title>Messages · Zari</Title>
    <div
      class="flex w-full flex-col justify-between space-y-3 sm:flex-row md:items-center"
    >
      <h1 class="text-2xl font-bold text-gray-700">Messages</h1>
      <button
        class="Btn w-44 items-center font-medium"
        @click="addStoreOpen = true"
      >
        <Icon name="plus" class="mr-2 h-4 stroke-2" />
        New Message
      </button>
    </div>
    <label
      class="flex max-w-lg items-center rounded-xl bg-white py-3 pl-2 text-sm text-gray-500 shadow-sm"
    >
      <Icon name="search" class="h-7" />
      <input
        type="text"
        class="w-full px-4 placeholder:text-gray-300 focus:outline-none"
        placeholder="Search keyword, Name, Message"
        v-model="search"
        @input="doSearch"
      />
    </label>

    <ResponsiveTable v-bind="{ data: { data: rows } }">
      <template #mobileHeader="{ i }">
        <ToggleSelections
          v-model="selected"
          v-bind="{ data: rows, mapFn: (v) => v }"
        />
      </template>
      <template #default="{ i }">
        <TableCell class="justify-center">
          <CheckBox v-bind="{ selected, value: i }">
            <input v-model="selected" type="checkbox" :value="i" hidden />
          </CheckBox>
        </TableCell>
        <TableCell class="flex items-center space-x-3">
          <span>To:</span>
          <img
            src="/images/user.png"
            alt="sample user"
            class="h-10 rounded-full"
          />
          <span>Zainab Love</span>
        </TableCell>
        <TableCell header="Message">
          <span
            class="max-w-sm lg:truncate lg:whitespace-nowrap xl:max-w-md 2xl:max-w-2xl"
          >
            Hello Zainab Love, your friend Luqman Edu might like some wine from
            Tammy’s Lane
          </span>
        </TableCell>
        <TableCell header="Date">24/01/2022</TableCell>
        <TableCell header="" class="space-x-4">
          <button class="rounded-lg bg-primary-alt p-2 text-primary">
            <Icon name="eye" class="h-6 w-6" />
          </button>
          <button class="rounded-lg bg-primary-alt p-2 text-primary">
            <Icon name="trash" class="h-6 w-6" />
          </button>
        </TableCell>
      </template>
    </ResponsiveTable>
    <SlideModal
      :open="addStoreOpen"
      staticBackDrop
      @close="addStoreOpen = false"
      title="Add Message"
    >
    </SlideModal>
  </div>
</template>

<script setup lang="ts">
import Icon from '~~/components/ui/icon.vue'
import ResponsiveTable from '~~/components/table/responsive-table.vue'
import CheckBox from '~~/components/input/check-box.vue'
import TableCell from '~~/components/table/table-cell.vue'
import SlideModal from '~~/components/ui/slide-modal.vue'
import ToggleSelections from '~~/components/ui/toggle-selections.vue'

// defines
definePageMeta({ layout: 'admin', middleware: ['auth'] })

// refs
const search = ref('')
const rows = new Array(10)
const addStoreOpen = ref(false)
const selected = ref<number[]>([])

// methods
const doSearch = useDebounce(() => {}, 500)
</script>
