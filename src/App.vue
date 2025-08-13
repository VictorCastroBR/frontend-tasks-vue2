<template>
  <v-app class="app-surface">
    <AppHeader
      :user="user"
      :company="company"
      v-if="!hideChrome"
      @toggle-drawer="drawer = !drawer"
      @logout="handleLogout"
    />

    <AppSidebar
      v-model="drawer"
      :items="navItems"
      v-if="!hideChrome"
    />

    <v-main>
      <v-container class="py-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import auth from '@/store/auth'
import api from '@/services/api'
import AppHeader from '@/components/App/AppHeader.vue'
import AppSidebar from '@/components/App/AppSidebar.vue'

export default {
  name: 'App',
  components: { AppHeader, AppSidebar },
  data: () => ({
    drawer: true,
    navItems: [
      { title: 'Dashboard',  icon: 'mdi-view-dashboard-outline', to: '/' },
      { title: 'Nova Tarefa', icon: 'mdi-plus-circle-outline', to: 'tarefa/nova' },
      { title: 'Equipe',      icon: 'mdi-account-group-outline',to: 'equipe' },
    ],
  }),
  computed: {
    isAuth() { return !!auth.state.token },
    user() { return auth.state.user },
    company() { return auth.getters.companyName() },
    hideChrome () {
      const metaHide = this.$route && this.$route.meta && this.$route.meta.hideChrome
      return metaHide || !auth.getters.isAuthenticated()
    }
  },
  methods: {
    async handleLogout() {
      try { await api.post('/auth/logout') } catch (e) { console.error(e) }
      auth.actions.logout()
      this.$router.push('/login')
    }
  }
}
</script>
