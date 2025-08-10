<template>
  <v-row justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card>
        <v-card-title>Login</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleLogin" ref="form">
            <v-text-field v-model="email" label="E-mail" type="email" required />
            <v-text-field v-model="password" label="Senha" type="password" required />
            <v-alert type="error" dense v-if="error">{{ error }}</v-alert>
            <v-btn :loading="loading" type="submit" color="primary" block>Entrar</v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <small class="grey--text">Use o usuário criado no seed/command.</small>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import api from '@/services/api'
import auth from '@/store/auth'

export default {
  data: () => ({ email: '', password: '', loading: false, error: '' }),
  methods: {
    async handleLogin() {
      this.loading = true; this.error = ''
      try {
        const { data } = await api.post('/auth/login', { email: this.email, password: this.password })
        auth.actions.loginSuccess({ token: data.token, user: data.user })
        this.$router.push('/tasks')
      } catch (e) {
        this.error = e?.response?.data?.message || 'Falha no login'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
