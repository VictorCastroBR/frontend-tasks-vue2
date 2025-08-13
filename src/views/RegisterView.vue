<template>
  <div class="auth-root" :style="gradientStyle">
    <div class="auth-inner">
      <v-card class="auth-card" flat>
        <v-card-title class="py-4">
          <div class="text-h6 font-weight-medium">Criar conta</div>
        </v-card-title>

        <v-divider />

        <v-card-text class="py-6 px-6">
          <v-form @submit.prevent="submit" ref="form">
            <v-text-field
              v-model="form.company_name"
              label="Nome da empresa"
              outlined dense clearable required
              class="mb-3"
            />

            <v-text-field
              v-model="form.company_slug"
              label="Slug (ex: minha-empresa)"
              :persistent-hint="true"
              outlined dense clearable required
              class="mb-3"
            />

            <v-text-field
              v-model="form.name"
              label="Seu nome"
              outlined dense clearable required
              class="mb-3"
            />

            <v-text-field
              v-model="form.email"
              label="E-mail"
              type="email"
              autocomplete="email"
              outlined dense clearable required
              class="mb-3"
            />

            <v-text-field
              :type="showPass ? 'text' : 'password'"
              v-model="form.password"
              label="Senha"
              autocomplete="new-password"
              outlined dense clearable required
              class="mb-2"
              :append-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="showPass = !showPass"
            />

            <v-alert type="error" dense v-if="err" class="mb-4">
              {{ err }}
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              :loading="loading"
              block
              class="btn-lg"
            >
              Criar conta
            </v-btn>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="px-6 py-4 d-flex justify-center">
          <span class="text--secondary mr-1">Já possui uma conta?</span>
          <v-btn text small color="primary" :to="{ name: 'login' }">
            Login
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
    form: {
      company_name: '',
      company_slug: '',
      name: '',
      email: '',
      password: ''
    },
    loading: false,
    err: '',
    showPass: false,
    primaryColor: '#7C4DFF'
  }),
  computed: {
    gradientStyle () {
      return {
        background: `linear-gradient(135deg, ${this.primaryColor} 0%, #0f0d14 100%)`
      }
    }
  },
  watch: {
    'form.company_name'(val) {
      if (!val) return (this.form.company_slug = '')
      this.form.company_slug = val
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 60)
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
    async submit () {
      this.loading = true; this.err = ''
      try {
        const { data } = await api.post('/auth/register', this.form)
        auth.actions.loginSuccess({ token: data.token, user: data.user })
        this.$router.push('/')
      } catch (e) {
        this.err = e?.response?.data?.message || 'Erro ao registrar'
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

.v-text-field >>> .v-input__control { min-height: 40px; }

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
