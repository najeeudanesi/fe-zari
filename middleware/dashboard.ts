export default defineNuxtRouteMiddleware(async () => {
  if (process.server) return
  const auth = await useAuth().value
  if (!auth?.token) return navigateTo('/auth/login')
  const roles = new Set(auth.user.roles?.map((r) => r.group))
  if (roles.has('admin')) return navigateTo('/stores')
  if (roles.has('vendor')) return navigateTo('/purchases')
  return await useLogout()
})
