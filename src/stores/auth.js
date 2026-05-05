import { defineStore } from 'pinia'
import { ref } from 'vue'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'

export const useAuthStore = defineStore('auth', () => {
  const isAdmin = ref(false)

  function login(username, password) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      isAdmin.value = true
      return true
    }
    return false
  }

  function logout() {
    isAdmin.value = false
  }

  return { isAdmin, login, logout }
})
