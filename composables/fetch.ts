import { $Fetch, $fetch, FetchOptions } from 'ohmyfetch'

export type ApiPagination = {
  currentPage: 1
  firstPage: 1
  firstPageUrl: string
  lastPage: number
  lastPageUrl: string
  nextPageUrl: string | null
  perPage: number
  previousPageUrl: string | null
  total: number
}
export type ApiList<T> = { meta?: ApiPagination; data: T[] }
export type ApiShow<T> = { data: T }
export type ApiError = { message: string; rule?: string; field?: string }

export const apiFetch: $Fetch = (request, opts) => {
  const config = useRuntimeConfig()
  const token = useCookie('token').value
  return $fetch(request, {
    baseURL: config.public.apiBaseUrl,
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
apiFetch.raw = $fetch.raw
apiFetch.create = $fetch.create

export const useApiFetch = <T>(
  url: string,
  opts: () => FetchOptions<'json'> & { group?: string }
) => {
  const route = useRoute()
  const key = route.fullPath + url
  const response = useLazyAsyncData<T>(key, () => apiFetch<T>(url, opts()))
  const { data, error, refresh } = response
  watchEffect(() => !error.value && !data.value && refresh())
  const options = opts()
  options.group && useRefresh(options.group, key)
  return { ...response, key }
}

const getRefreshId = (group: string) => group + '.refreshId'

export const useRefresh = (group: string, refreshKey: string) => {
  const refreshId = useState<number>(getRefreshId(group))
  const refreshes = useState(
    group + '.refreshes',
    () => new Map<string, number>()
  )
  const lastRefreshId = refreshes.value.get(refreshKey)
  watchEffect(() => {
    if (refreshId.value === lastRefreshId) return
    refreshNuxtData(refreshKey)
    refreshes.value = refreshes.value.set(refreshKey, refreshId.value)
  })
}

export const refreshGroups = (groups: string[]) =>
  groups.forEach((group) => (useState(getRefreshId(group)).value = Date.now()))

export const usePaginate =
  (refresh: () => Promise<void>) =>
  async (pagination: { page: number; perPage: number }) => {
    const router = useRouter()
    await router.push({ query: pagination })
    refresh()
  }
