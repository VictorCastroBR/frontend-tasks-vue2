<template>
  <div>
    <v-card class="rounded-xl elevation-2 mb-4">
      <v-toolbar flat color="transparent" class="px-4">
        <v-toolbar-title class="text-h6 font-weight-bold">Equipe</v-toolbar-title>
        <v-spacer />
        <v-text-field
          v-model.trim="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar por nome ou e-mail"
          dense
          outlined
          hide-details
          clearable
          class="mr-4"
          style="max-width: 320px"
        />
        <v-btn color="primary" depressed :to="{ name: 'user-new' }">
          <v-icon left>mdi-account-plus</v-icon>
          Novo usuário
        </v-btn>
      </v-toolbar>
    </v-card>

    <v-card class="rounded-xl elevation-2">
      <TeamTable
        :users="filteredUsers"
        :loading="loading"
        @edit="goEdit"
        @change-password="openChangePassword"
      />
    </v-card>

    <PasswordDialog
      v-model="pwdDlg.open"
      :user-id="pwdDlg.userId"
      :loading="pwdDlg.loading"
      :error="pwdDlg.error"
      :success="pwdDlg.success"
      @save="changePassword"
    />
  </div>
</template>

<script>
import api from '@/services/api'
import TeamTable from '@/components/Team/TeamTable.vue'
import PasswordDialog from '@/components/Team/PasswordDialog.vue'

export default {
  name: 'TeamView',
  components: { TeamTable, PasswordDialog },
  data: () => ({
    users: [],
    loading: false,
    search: '',
    pwdDlg: { open: false, userId: null, loading: false, error: '', success: '' }
  }),
  computed: {
    filteredUsers () {
      const q = this.search.toLowerCase().trim()
      if (!q) return this.users
      return this.users.filter(u =>
        String(u.name || '').toLowerCase().includes(q) ||
        String(u.email || '').toLowerCase().includes(q)
      )
    }
  },
  created () { this.fetch() },
  methods: {
    async fetch () {
      this.loading = true
      try {
        const { data } = await api.get('/company/users')
        this.users = data.data || data
      } finally {
        this.loading = false
      }
    },
    goEdit (u) {
      this.$router.push({ name: 'user-edit', params: { id: u.id } })
    },
    openChangePassword (u) {
      this.pwdDlg = { open: true, userId: u.id, loading: false, error: '', success: '' }
    },
    async changePassword ({ userId, password, confirm }) {
      if (!password || password.length < 6) {
        this.pwdDlg.error = 'A senha deve ter ao menos 6 caracteres.'
        return
      }
      if (password !== confirm) {
        this.pwdDlg.error = 'As senhas não conferem.'
        return
      }
      this.pwdDlg.loading = true
      this.pwdDlg.error = ''
      this.pwdDlg.success = ''
      try {
        await api.put(`/company/users/${userId}/password`, { password })
        this.pwdDlg.success = 'Senha atualizada com sucesso!'
        setTimeout(() => { this.pwdDlg.open = false }, 800)
      } catch (e) {
        this.pwdDlg.error = e?.response?.data?.message || 'Erro ao alterar a senha'
      } finally {
        this.pwdDlg.loading = false
      }
    }
  }
}
</script>
