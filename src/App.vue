<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Tasks App</v-toolbar-title>
      <v-spacer />
      <div v-if="isAuth" class="mr-4">
        <v-chip small class="mr-2" color="white" text-color="primary">
          {{ company }}
        </v-chip>
        <span>{{ user?.name }}</span>
      </div>
      <v-btn v-if="isAuth" text @click="handleLogout">Sair</v-btn>
    </v-app-bar>

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

export default {
  name: 'App',
  computed: {
    isAuth() { return !!auth.state.token },
    user() { return auth.state.user },
    company() { return auth.getters.companyName() }
  },
  methods: {
    async handleLogout() {
      try {
        await api.post('/auth/logout')
      } catch (e) {
        console.error(e)
      }
      auth.actions.logout()
      this.$router.push('/login')
    }
  }
}
</script>
