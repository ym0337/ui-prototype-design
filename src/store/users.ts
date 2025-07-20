// store/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  // State - 使用 ref 定义响应式状态
  const user = ref({
    id: '',
    name: '未登录用户',
    email: '',
    avatar: ''
  })
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref('')

  // Getters - 使用 computed 定义计算属性
  const isAdmin = computed(() => user.value.id === 'admin')
  const welcomeMessage = computed(() => 
    `欢迎${isAuthenticated.value ? user.value.name : '游客'}`
  )

  // Actions - 定义方法
  async function login(username: string, password: string) {
    loading.value = true
    error.value = ''
    
    try {
      const response = await axios.post('/api/login', { username, password })
      user.value = response.data.user
      isAuthenticated.value = true
    } catch (err) {
      error.value = err.response?.data?.message || '登录失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await axios.post('/api/logout')
      resetUser()
    } finally {
      loading.value = false
    }
  }

  function resetUser() {
    user.value = {
      id: '',
      name: '未登录用户',
      email: '',
      avatar: ''
    }
    isAuthenticated.value = false
  }

  // 暴露需要访问的状态和方法
  return {
    user,
    isAuthenticated,
    loading,
    error,
    isAdmin,
    welcomeMessage,
    login,
    logout,
    resetUser,
    persist: { // 持久化
      enabled: true,
      strategies: [
        {
          key: 'user',
          storage: localStorage,
          paths: ['user', 'isAuthenticated']
        }
      ]
    }
  }
})