<template>
  <div>
    <v-card class="mb-3">
      <v-card-title>Equipe</v-card-title>
      <v-card-actions>
        <v-btn color="primary" @click="openCreate">Novo usuário</v-btn>
      </v-card-actions>
    </v-card>

    <TeamTable
      :users="users"
      :loading="loading"
      @edit="openEdit"
      @change-password="openChangePassword"
    />

    <UserDialog
      v-model="userDlg.open"
      :mode="userDlg.mode"
      :user="userDlg.user"
      :loading="userDlg.loading"
      :error="userDlg.error"
      @save="saveUser"
    />

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
import UserDialog from '@/components/Team/UserDialog.vue'
import PasswordDialog from '@/components/Team/PasswordDialog.vue'

export default {
  components: { TeamTable, UserDialog, PasswordDialog },
  data: () => ({
    users: [],
    loading: false,
    userDlg: { open: false, mode: 'create', user: null, loading: false, error: '' },
    pwdDlg: { open: false, userId: null, loading: false, error: '', success: '' },
  }),
  created () { this.fetch() },
  methods: {
    async fetch () {
      this.loading = true
      try {
        const { data } = await api.get('/company/users')
        this.users = data.data || data
      } finally { this.loading = false }
    },
    openCreate () {
      this.userDlg = { open: true, mode: 'create', user: null, loading: false, error: '' }
    },
    openEdit (u) {
      this.userDlg = { open: true, mode: 'edit', user: { ...u }, loading: false, error: '' }
    },
    async saveUser (payload) {
      this.userDlg.loading = true
      this.userDlg.error = ''
      try {
        if (this.userDlg.mode === 'create') {
          await api.post('/company/users', payload)
        } else {
          const { id, ...rest } = payload
          await api.put(`/company/users/${id}`, rest)
        }
        this.userDlg.open = false
        await this.fetch()
      } catch (e) {
        this.userDlg.error = e?.response?.data?.message || 'Erro ao salvar'
      } finally { this.userDlg.loading = false }
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
      } finally { this.pwdDlg.loading = false }
    }
  }
}
</script>
