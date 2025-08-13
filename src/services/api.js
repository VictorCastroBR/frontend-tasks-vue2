import axios from 'axios'
import router from '@/router'

const API_URL = process.env.VUE_APP_API_URL
const REFRESH_URL = '/auth/refresh'

const api = axios.create({ baseURL: API_URL })

function getToken() {
  return localStorage.getItem('token')
}
function setToken(newToken) {
  if (!newToken) return
  localStorage.setItem('token', newToken)
  api.defaults.headers.Authorization = `Bearer ${newToken}`
}
function clearAuthAndGoLogin() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let subscribers = []

function onRefreshed(token) {
  subscribers.forEach((cb) => cb(token))
  subscribers = []
}
function addSubscriber(cb) {
  subscribers.push(cb)
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error
    if (!response) return Promise.reject(error)

    const status = response.status
    const originalRequest = config

    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes(REFRESH_URL)

    if ((status === 401 || status === 403) && !isAuthRoute) {
      if (originalRequest.__isRetryRequest) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addSubscriber((newToken) => {
            if (!newToken) return reject(error)
            originalRequest.__isRetryRequest = true
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(api(originalRequest))
          })
        })
      }

      isRefreshing = true
      try {
        const currentToken = getToken()
        const refreshClient = axios.create({ baseURL: API_URL })
        const refreshResp = await refreshClient.post(
          REFRESH_URL,
          {},
          {
            withCredentials: true,
            headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : {}
          }
        )

        const newToken =
          refreshResp.data?.access_token ||
          refreshResp.data?.token ||
          refreshResp.data?.data?.token

        if (!newToken) {
          throw new Error('Refresh não retornou novo token')
        }

        setToken(newToken)
        onRefreshed(newToken)

        originalRequest.__isRetryRequest = true
        originalRequest.headers.Authorization = `Bearer ${newToken}`

        return api(originalRequest)
      } catch (e) {
        onRefreshed(null)
        clearAuthAndGoLogin()
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
