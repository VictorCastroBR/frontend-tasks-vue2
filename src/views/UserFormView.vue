<template>
  <v-container class="py-8" style="max-width: 880px;">
    <v-card class="rounded-xl elevation-2">
      <v-toolbar flat color="transparent" class="px-6 pt-4">
        <v-toolbar-title class="text-h5 font-weight-bold">
          {{ isEdit ? 'Editar Usuário' : 'Novo Usuário' }}
        </v-toolbar-title>
        <v-spacer />
        <v-chip v-if="isEdit" small label color="primary" text-color="white">#{{ form.id }}</v-chip>
      </v-toolbar>

      <v-divider />

      <v-card-text class="px-6 py-6">
        <template v-if="initialLoading">
          <v-skeleton-loader type="heading, paragraph, list-item, list-item, actions" />
        </template>

        <v-form v-else ref="form" @submit.prevent="handleSubmit" lazy-validation>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.trim="form.name"
                label="Nome"
                outlined dense clearable
                prepend-inner-icon="mdi-account"
                :rules="[rules.required, rules.max(120)]"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model.trim="form.email"
                label="E-mail"
                type="email"
                outlined dense clearable
                prepend-inner-icon="mdi-email-outline"
                :rules="[rules.required, rules.email]"
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-switch
                v-model="form.is_admin"
                inset
                class="mt-0"
                label="Administrador?"
                :true-value="true"
                :false-value="false"
              />
            </v-col>

            <!-- Senha só no create -->
            <v-col cols="12" sm="6" v-if="!isEdit">
              <v-text-field
                v-model="form.password"
                :append-icon="showPwd ? 'mdi-eye-off' : 'mdi-eye'"
                :type="showPwd ? 'text' : 'password'"
                @click:append="showPwd = !showPwd"
                label="Senha"
                outlined dense clearable
                prepend-inner-icon="mdi-lock-outline"
                :rules="[rules.required, rules.min(6)]"
                hint="Mínimo 6 caracteres"
                persistent-hint
              />
            </v-col>
          </v-row>

          <v-alert
            v-if="error"
            type="error"
            dense outlined text class="mt-2"
          >
            {{ error }}
          </v-alert>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-6 py-4">
        <v-btn text :disabled="loading" @click="$router.back()">Voltar</v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          class="px-6"
          depressed
          :loading="loading"
          @click="$refs.form && $refs.form.validate() && handleSubmit()"
        >
          {{ isEdit ? 'Salvar' : 'Criar' }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="snack.open" :timeout="2500">
      {{ snack.text }}
      <v-btn text @click="snack.open = false">Fechar</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'UserFormView',
  computed: {
    isEdit () { return !!this.$route.params.id }
  },
  data: () => ({
    initialLoading: false,
    loading: false,
    error: '',
    showPwd: false,
    snack: { open: false, text: '' },
    form: { id: null, name: '', email: '', password: '', is_admin: false },
    rules: {
      required: v => (!!v && String(v).trim().length > 0) || 'Obrigatório',
      max: n => v => !v || String(v).length <= n || `Máx. ${n} caracteres`,
      min: n => v => !v || String(v).length >= n || `Mín. ${n} caracteres`,
      email: v => !v || /^\S+@\S+\.\S+$/.test(v) || 'E-mail inválido'
    }
  }),
  created () { if (this.isEdit) this.fetchOne() },
  methods: {
    async fetchOne () {
      this.initialLoading = true
      this.error = ''
      try {
        const { data } = await api.get(`/company/users/${this.$route.params.id}`)
        const u = data.data || data
        this.form = {
          id: u.id,
          name: u.name || '',
          email: u.email || '',
          is_admin: !!u.is_admin,
          password: ''
        }
      } catch (e) {
        this.error = 'Não foi possível carregar o usuário.'
      } finally {
        this.initialLoading = false
      }
    },
    async handleSubmit () {
      this.loading = true
      this.error = ''
      try {
        if (this.isEdit) {
            const { id, ...rest } = this.form
            await api.put(`/company/users/${id}`, rest)
            this.snack = { open: true, text: 'Usuário atualizado!' }
        } else {
          const payload = { ...this.form }
          await api.post('/company/users', payload)
          this.snack = { open: true, text: 'Usuário criado!' }
        }
        this.$router.push({ name: 'users' })
      } catch (e) {
        this.error = e?.response?.data?.message || 'Erro ao salvar.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
