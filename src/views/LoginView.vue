<template>
  <div class="auth-root" :style="gradientStyle">
    <div class="auth-inner">
      <v-card class="auth-card" flat>
        <v-card-title class="py-4">
          <div class="text-h6 font-weight-medium">Acessar conta</div>
        </v-card-title>

        <v-divider />

        <v-card-text class="py-6 px-6">
          <v-form @submit.prevent="handleLogin" ref="form">
            <v-text-field
              v-model="email"
              label="E-mail"
              type="email"
              outlined
              dense
              clearable
              autocomplete="email"
              class="mb-3"
              required
            />
            <v-text-field
              v-model="password"
              label="Senha"
              type="password"
              outlined
              dense
              clearable
              autocomplete="current-password"
              class="mb-2"
              required
            />

            <v-alert type="error" dense v-if="error" class="mb-4">
              {{ error }}
            </v-alert>

            <v-btn :loading="loading" type="submit" color="primary" block class="btn-lg">
              Entrar
            </v-btn>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="px-6 py-4 d-flex justify-center">
          <span class="text--secondary mr-1">Não possui uma conta?</span>
          <v-btn text small color="primary" :to="{ name: 'register' }">
            Registrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'
import auth from '@/store/auth'

export default {
  data: () => ({
    email: '',
    password: '',
    loading: false,
    error: '',
    primaryColor: '#7C4DFF'
  }),
  computed: {
    gradientStyle () {
      return {
         background: `linear-gradient(135deg, ${this.primaryColor} 0%, #0f0d14 100%)`
      }
    }
  },
  mounted () {
    try {
      const theme = this.$vuetify.theme.dark
        ? this.$vuetify.theme.themes.dark
        : this.$vuetify.theme.themes.light
      if (theme?.primary) this.primaryColor = theme.primary
    } catch (_) {
      console.error(_)
    }
  },
  methods: {
    async handleLogin () {
      this.loading = true
      this.error = ''
      try {
        const { data } = await api.post('/auth/login', {
          email: this.email,
          password: this.password
        })
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

<style scoped>
.auth-root {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
}

.auth-inner {
  min-height: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
}

.auth-card {
  background: #FFFFFF !important;
  border-radius: 16px;
  box-shadow: none !important;
  max-width: 480px;
  width: 100%;
}

.btn-lg {
  height: 44px;
  border-radius: 10px;
  text-transform: none;
  font-weight: 600;
}

.v-text-field >>> .v-input__control {
  min-height: 40px;
}

:deep(.container) {
  max-width: none !important;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  box-sizing: border-box;
}
</style>

<style>
html, body, #app, .v-application {
  height: 100%;
  margin: 0;
  background: transparent !important;
}
</style>
