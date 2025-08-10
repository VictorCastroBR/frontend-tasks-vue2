const state = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null')
}

const getters = {
  isAuthenticated: () => !!state.token,
  user: () => state.user,
  companyName: () => state.user?.company?.name || ''
}

const actions = {
  loginSuccess({ token, user }) {
    state.token = token
    state.user = user
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  },
  logout() {
    state.token = null
    state.user = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

export default { state, getters, actions }
