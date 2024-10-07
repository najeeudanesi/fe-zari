import { Ref } from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { utils as XLSXUtils, writeFile as writeXLSXFile, utils } from 'xlsx';

export type KeyFn<T> = (item: T) => string
export type KeySelect<T = Record<string, any>> = keyof T | KeyFn<T>

export type NavItem = {
  title: KeySelect<NavItem>
  to?: string
  icon?: string
  handler?: (...args: unknown[]) => void
  key?: KeySelect<NavItem>
  loading?: boolean
  permission?: string
} & Record<string, any>

export type Toast = {
  id: number
  message: string
  details: string
  type: 'success' | 'warning' | 'error' | 'info'
  action?: {
    text: string
    handler: () => void
  }
  timeout: number
}

export const useRouteModal = (
  page: string,
  routes?: string[]
): [Ref<string>, Ref<boolean>, RouteLocationNormalizedLoaded] => {
  const route = useRoute()
  const title = useState(`${page}/modalTitle`, () => '')
  const open = computed(
    () => !!routes?.find((r) => route.path.match(new RegExp(r)))
  )
  return [title, open, route]
}

export const useToast = () => {
  const toasts = useState<Set<Toast>>('ui/toasts', () => new Set())
  const addToast = (toast: Partial<Toast>) => {
    const timeout = toast.timeout ?? 3 + (toast.details?.length ?? 0) / 17
    const defaultToast: Toast = {
      id: Date.now(),
      message: '',
      details: '',
      type: 'info',
      timeout
    }
    toasts.value = toasts.value.add({ ...defaultToast, ...toast })
  }
  const removeToast = (toast: Toast) => {
    toasts.value.delete(toast)
    toasts.value = toasts.value
  }
  return { toasts, addToast, removeToast }
}

export const getWindowSize = () => {
  if (!process.client) return { width: 0, height: 0 }
  const { innerWidth, innerHeight } = window
  return { width: innerWidth, height: innerHeight }
}

export const useWindowSize = () => {
  const windowSize = reactive(getWindowSize())
  const handleResize = () => Object.assign(windowSize, getWindowSize())
  watchEffect(() => {
    if (!process.client) return
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })
  return windowSize
}


export const  exportCategoriesToXLSX =  (data : any, name : string) => {
  const worksheet = XLSXUtils.json_to_sheet(data);
  const workbook = XLSXUtils.book_new();
  XLSXUtils.book_append_sheet(workbook, worksheet, name);
  writeXLSXFile(workbook, `${name}.xlsx`);
};