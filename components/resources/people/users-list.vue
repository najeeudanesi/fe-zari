<template>
  <div class="flex w-full flex-col space-y-8 px-4 pb-0 sm:p-2">
    <div class="flex w-full items-center justify-between">
      <label class="flex w-full max-w-lg items-center rounded-xl bg-white py-3 pl-2 text-sm text-gray-500 shadow-sm">
        <Icon name="search" class="h-7" />
        <input type="text" class="w-full px-4 placeholder:text-gray-300 focus:outline-none"
          placeholder="Search usrname, name, email or phone number" v-model="search" @input="doSearch" />
      </label>
      <slot name="actions"> </slot>
    </div>

    <ResponsiveTable v-bind="{ data: users, pending, skeleton: { rows: 3, columns: 7 } }" @paginate="paginate">
      <template #header>
        <th>
          <ToggleSelections v-model="selected" v-bind="{ data: users?.data, mapFn: (v: User) => v.id }" />
        </th>
        <th class="px-4 text-left">Username</th>
        <th class="px-4 text-left">Name</th>
        <th class="px-4 text-left">Contact Info</th>
        <th></th>
      </template>
      <template #mobileHeader="{ row: user }: TableRow<User>">
        <div class="flex items-center text-sm text-gray-600">
          <CheckBox v-bind="{ selected, value: user.id }">
            <input v-model="selected" type="checkbox" :value="user.id" hidden />
          </CheckBox>
          <span class="ml-4 flex items-center">{{ user.name }}</span>
        </div>
      </template>
      <template #default="{ row: user }: TableRow<User>">
        <TableCell class="justify-center">
          <CheckBox v-bind="{ selected, value: user.id }">
            <input v-model="selected" type="checkbox" :value="user.id" hidden />
          </CheckBox>
        </TableCell>
        <TableCell class="flex items-center" header="Username">{{
            user.username
          }}</TableCell>
        <TableCell>
          <div class="flex flex-col space-y-3">
            <span>{{ user.name }}</span>
            <span v-for="store in user.stores" class="text-xs">
              <b class="mr-2 font-semibold">Store:</b>{{ store.name }}
            </span>
          </div>
        </TableCell>
        <TableCell header="Email">
          <div class="flex flex-col space-y-3 text-xs">
            <div v-if="user.email" class="flex space-x-2">
              <span class="font-semibold text-gray-500">Email:</span>
              <span>{{ user.email }}</span>
            </div>
            <div v-if="user.phone" class="flex space-x-2">
              <span class="font-semibold text-gray-500">Phone:</span>
              <span>{{ user.phone }}</span>
            </div>
          </div>
        </TableCell>
        <TableCell header="" class="space-x-4">
          <slot name="userActions" v-bind="{ user, basePath }"></slot>
        </TableCell>
      </template>
    </ResponsiveTable>
    <SlideModal :open="modalOpen" staticBackDrop @close="$router.replace(basePath)" :title="modalTitle">
      <NuxtPage />
    </SlideModal>
    <ConfirmDelete v-bind="{ item: deleteUser, deleteFn: deleteAdmin, name: (admin: User) => admin?.name }"
      @cancelled="emit('cancel-delete')" @deleted="deleteDone" />
  </div>
</template>

<script setup lang="ts">
import Icon from '~~/components/ui/icon.vue'
import ResponsiveTable, {
  TableRow
} from '~~/components/table/responsive-table.vue'
import CheckBox from '~~/components/input/check-box.vue'
import TableCell from '~~/components/table/table-cell.vue'
import SlideModal from '~~/components/ui/slide-modal.vue'
import { ApiList } from '~~/composables/fetch'
import { RoleGroup, User } from '~~/composables/resources/people'
import ToggleSelections from '~~/components/ui/toggle-selections.vue'
import ConfirmDelete from '../confirm-delete.vue'

// defines
const props = defineProps<{ role: RoleGroup; deleteUser?: User }>()
const emit = defineEmits(['cancel-delete', 'deleted'])

// refs
const basePath = props.role === 'user' ? '/users' : `/users/${props.role}`
const route = useRoute()
const search = ref('')
const selected = ref<number[]>([])
const {
  data: users,
  refresh,
  pending
} = useApiFetch<ApiList<User>>('users', () => ({
  params: {
    'relations[]': ['roles', 'avatar', 'stores'],
    'roles[]': [props.role],
    search: search.value,
    page: route.query.page ?? 1,
    perPage: route.query.perPage ?? 10
  },
  group: basePath
}))
const [modalTitle, modalOpen] = useRouteModal(basePath, [
  `${basePath}/add-admin`,
  `${basePath}/edit`,
  `${basePath}/view`
])

// methods
const doSearch = useDebounce(() => {
  refresh()
}, 200)
const paginate = usePaginate(refresh)
const deleteAdmin = (user: User) =>
  apiFetch(`users/${user.id}`, { method: 'delete' })

const deleteDone = () => {
  refresh()
  emit('deleted')
}
</script>
