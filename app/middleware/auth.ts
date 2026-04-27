export default defineNuxtRouteMiddleware((to, from) => {
  
  if (to.path === '/admin/login') {
    return
  }

  
  if (process.client) {
    const token = localStorage.getItem('token')
    if (!token) {
      
      return navigateTo('/admin/login')
    }
  }
})