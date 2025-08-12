<template>
  <v-dialog :value="value" max-width="480" @input="$emit('input', $event)">
    <v-card>
      <v-card-title>Alterar senha</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="form.password"
          :type="show1 ? 'text' : 'password'"
          label="Nova senha"
          :append-icon="show1 ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="show1 = !show1"
        />
        <v-text-field
          v-model="form.confirm"
          :type="show2 ? 'text' : 'password'"
          label="Confirmar nova senha"
          :append-icon="show2 ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="show2 = !show2"
        />
        <v-alert type="error" dense v-if="error" class="mt-2">{{ error }}</v-alert>
        <v-alert type="success" dense v-if="success" class="mt-2">{{ success }}</v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text :disabled="loading" @click="$emit('input', false)">Cancelar</v-btn>
        <v-btn color="primary" :loading="loading" @click="onSave">Salvar nova senha</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'PasswordDialog',
  props: {
    value: { type: Boolean, default: false },
    userId: { type: [String, Number], required: true },
    loading: { type: Boolean, default: false },
    error: { type: String, default: '' },
    success: { type: String, default: '' },
  },
  data: () => ({
    form: { password: '', confirm: '' },
    show1: false,
    show2: false,
  }),
  watch: {
    value (v) {
      if (v) this.form = { password: '', confirm: '' }
    }
  },
  methods: {
    onSave () {
      this.$emit('save', { userId: this.userId, ...this.form })
    }
  }
}
</script>
