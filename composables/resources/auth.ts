import { ApiShow } from '../fetch'
import { RoleGroup, User } from './people'

export type Auth = { token: { type: 'bearer'; token: string }; user: User }

export const setAuth = (auth?: Auth) => {
  useCookie<string | undefined>('token').value = auth?.token.token
  useState<Auth | undefined>('auth').value = auth
}

export const usePermissions = () =>
  useState<Set<string>>('permissions', () => new Set())

export const userRelations = ['roles', 'stores'] as const

export const useAuth = () =>
  computed({
    get: async (): Promise<Auth | undefined> => {
      if (process.server) return
      const auth = useState<Auth | undefined>('auth').value
      const token = useCookie<string | undefined>('token')
      if (typeof auth !== 'undefined' || typeof token.value === 'undefined')
        return auth
      try {
        const { data: user } = await apiFetch<ApiShow<User>>('me', {
          params: { 'relations[]': userRelations }
        })
        const newAuth: Auth = {
          token: { type: 'bearer', token: token.value },
          user
        }
        useAuth().value = promisify(newAuth)
        return newAuth
      } catch (error) {
        useAuth().value = promisify(undefined)
        return undefined
      }
    },
    set: async (authPromise) => {
      const auth = await authPromise
      useCookie<string | undefined>('token').value = auth?.token.token
      useState<Auth | undefined>('auth').value = auth
      const permissions = auth?.user.roles?.flatMap((role) =>
        role.permissions.map((p) => p.code)
      )
      usePermissions().value = new Set(permissions || [])
    }
  })

const promisify = async <T>(v: T) => v

export const useLogout = () => {
  apiFetch('auth/logout', { method: 'post' })
  useAuth().value = promisify(undefined)
  const { addToast } = useToast()
  addToast({ type: 'info', message: 'Logged out' })
  return navigateTo('/auth/login')
}

export const userRole = (): RoleGroup | undefined => {
  const auth = useState<Auth | undefined>('auth').value
  if (!auth?.user.roles) return
  const roles = new Set(auth.user.roles.map((r) => r.group))
  if (roles.has('admin')) return 'admin'
  return auth.user.roles[0]?.group
}

export const hasPermission = (code: string): boolean =>
  usePermissions().value.has(code)
