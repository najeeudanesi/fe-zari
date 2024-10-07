export default defineNuxtRouteMiddleware(async () => {
  if (process.server) return
  const auth = await useAuth().value
  // if (!auth?.token) return navigateTo('/auth/login')
})
