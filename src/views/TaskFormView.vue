<template>
  <v-card max-width="700" class="mx-auto">
    <v-card-title>{{ isEdit ? 'Editar Tarefa' : 'Nova Tarefa' }}</v-card-title>
    <v-card-text>
      <v-form ref="form" @submit.prevent="handleSubmit">
        <v-text-field v-model="form.title" label="Título" required />
        <v-textarea v-model="form.description" label="Descrição" rows="3" />
        <v-row>
          <v-col cols="12" sm="6">
            <v-select v-model="form.status" :items="statusItems" label="Status" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select v-model="form.priority" :items="priorityItems" label="Prioridade" />
          </v-col>
        </v-row>
        <v-text-field v-model="form.due_date" label="Prazo (YYYY-MM-DD)" placeholder="2025-08-15" />
        <v-alert type="error" dense v-if="error">{{ error }}</v-alert>
        <v-btn type="submit" color="primary" :loading="loading">{{ isEdit ? 'Salvar' : 'Criar' }}</v-btn>
        <v-btn text @click="$router.back()">Voltar</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import api from '@/services/api'

export default {
  props: { id: String },
  data: () => ({
    loading: false,
    error: '',
    form: { title:'', description:'', status:'pending', priority:'medium', due_date:'' },
    statusItems: ['pending','doing','done'],
    priorityItems: ['low','medium','high']
  }),
  computed: { isEdit() { return !!this.$route.params.id } },
  created() { if (this.isEdit) this.fetchOne() },
  methods: {
    async fetchOne() {
      const { data: task } = await api.get(`/tasks/${this.$route.params.id}`)
      this.form = {
        title: task.data.title,
        description: task.data.description,
        status: task.data.status,
        priority: task.data.priority,
        due_date: task.data.due_date || ''
      }
    },
    async handleSubmit() {
      this.loading = true; this.error = ''
      try {
        if (this.isEdit) {
          await api.put(`/tasks/${this.$route.params.id}`, this.form)
        } else {
          await api.post('/tasks', this.form)
        }
        this.$router.push({ name: 'tasks' })
      } catch (e) {
        this.error = e?.response?.data?.message || 'Erro ao salvar'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
