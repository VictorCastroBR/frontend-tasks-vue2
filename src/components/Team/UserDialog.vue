<template>
  <v-dialog :value="value" max-width="500" @input="$emit('input', $event)">
    <v-card>
      <v-card-title class="text-wrap">
        {{ mode === 'edit' ? 'Editar usuário' : 'Novo usuário' }}
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="local.name" label="Nome" />
        <v-text-field v-model="local.email" label="E-mail" type="email" />
        <v-text-field
          v-if="mode === 'create'"
          v-model="local.password"
          label="Senha"
          type="password"
        />
        <v-switch v-model="local.is_admin" label="Admin?" />
        <v-alert type="error" dense v-if="error" class="mt-2">{{ error }}</v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text :disabled="loading" @click="$emit('input', false)">Cancelar</v-btn>
        <v-btn color="primary" :loading="loading" @click="onSave">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'UserDialog',
  props: {
    value: { type: Boolean, default: false },
    mode: { type: String, default: 'create' },
    user: { type: Object, default: null },
    loading: { type: Boolean, default: false },
    error: { type: String, default: '' },
  },
  data: () => ({
    local: { id: null, name: '', email: '', password: '', is_admin: false }
  }),
  watch: {
    value (v) {
      if (v) this.hydrate()
    },
    user: {
      immediate: true,
      handler () { if (this.value) this.hydrate() }
    }
  },
  methods: {
    hydrate () {
      if (this.mode === 'edit' && this.user) {
        const { id, name, email, is_admin } = this.user
        this.local = { id, name, email, is_admin: !!is_admin, password: '' }
      } else {
        this.local = { id: null, name: '', email: '', password: '', is_admin: false }
      }
    },
    onSave () {
      const payload = { ...this.local }
      if (this.mode === 'edit') delete payload.password
      this.$emit('save', payload)
    }
  }
}
</script>
