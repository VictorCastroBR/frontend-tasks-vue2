<template>
  <v-card max-width="720" class="mx-auto rounded-xl elevation-0">
    <v-toolbar flat color="transparent" class="px-6 pt-4">
      <v-toolbar-title class="text-h5 font-weight-bold">
        {{ isEdit ? 'Editar Tarefa' : 'Nova Tarefa' }}
      </v-toolbar-title>
      <v-spacer />
      <v-chip
        v-if="isEdit"
        small
        class="text-capitalize"
        :color="statusColor(form.status)"
        text-color="white"
      >
        {{ statusLabel(form.status) }}
      </v-chip>
    </v-toolbar>

    <v-divider />

    <v-card-text class="px-6 py-6">
      <template v-if="initialLoading">
        <v-skeleton-loader type="heading, paragraph, list-item, list-item, actions" />
      </template>

      <v-form v-else ref="form" @submit.prevent="handleSubmit" lazy-validation>
        <v-text-field
          v-model.trim="form.title"
          label="Título"
          outlined
          dense
          clearable
          prepend-inner-icon="mdi-format-title"
          counter="120"
          :rules="[rules.required, rules.max(120)]"
          class="mb-4"
        />

        <v-textarea
          v-model.trim="form.description"
          label="Descrição"
          outlined
          dense
          auto-grow
          clearable
          prepend-inner-icon="mdi-text"
          counter="500"
          :rules="[rules.max(500)]"
          class="mb-6"
        />

        <v-row dense>
          <v-col cols="12" sm="6">
            <div class="text-caption mb-2 grey--text text--darken-1">Status</div>
            <v-chip-group
              v-model="form.status"
              active-class="primary"
              column
              class="d-flex flex-wrap"
              mandatory
            >
              <v-chip
                v-for="s in statusItems"
                :key="s.value"
                :value="s.value"
                label
                outlined
                class="mr-2 mb-2 text-capitalize"
              >
                <v-icon left small>{{ s.icon }}</v-icon>
                {{ s.title }}
              </v-chip>
            </v-chip-group>
          </v-col>

          <v-col cols="12" sm="6">
            <div class="text-caption mb-2 grey--text text--darken-1">Prioridade</div>
            <v-chip-group
              v-model="form.priority"
              active-class="primary"
              column
              class="d-flex flex-wrap"
              mandatory
            >
              <v-chip
                v-for="p in priorityItems"
                :key="p.value"
                :value="p.value"
                label
                outlined
                class="mr-2 mb-2 text-capitalize"
              >
                <v-icon left small>{{ p.icon }}</v-icon>
                {{ p.title }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>

        <v-row dense class="mt-2">
          <v-col cols="12" sm="6">
            <v-menu
              ref="dueMenu"
              v-model="dueMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="330"
              min-width="330"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-bind="attrs"
                  v-on="on"
                  label="Prazo"
                  outlined
                  dense
                  readonly
                  clearable
                  :value="displayDate"
                  @click:clear="clearDueDate"
                  prepend-inner-icon="mdi-calendar"
                  hint="Formato: AAAA-MM-DD"
                  persistent-hint
                />
              </template>
              <v-date-picker
                v-model="internalDate"
                @change="applyDate"
                scrollable
                show-current
                locale="pt-br"
                :first-day-of-week="1"
              />
            </v-menu>
          </v-col>
        </v-row>

        <v-alert
          v-if="error"
          type="error"
          dense
          outlined
          text
          class="mt-2"
        >
          {{ error }}
        </v-alert>
      </v-form>
    </v-card-text>

    <v-divider />

    <v-card-actions class="px-6 py-4">
      <v-btn text @click="$router.back()" :disabled="loading">Voltar</v-btn>
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
</template>

<script>
import api from '@/services/api'

export default {
  props: { id: String },
  data: () => ({
    loading: false,
    initialLoading: false,
    error: '',
    dueMenu: false,
    internalDate: null,
    form: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      due_date: ''
    },
    statusItems: [
      { title: 'Pendente', value: 'pending', icon: 'mdi-clock-outline' },
      { title: 'Fazendo', value: 'doing', icon: 'mdi-progress-clock' },
      { title: 'Concluído', value: 'done', icon: 'mdi-check-circle-outline' }
    ],
    priorityItems: [
      { title: 'Baixa', value: 'low', icon: 'mdi-arrow-down' },
      { title: 'Média', value: 'medium', icon: 'mdi-arrow-right' },
      { title: 'Alta', value: 'high', icon: 'mdi-arrow-up' }
    ],
    rules: {
      required: v => (!!v && String(v).trim().length > 0) || 'Obrigatório',
      max: n => v => !v || String(v).length <= n || `Máx. ${n} caracteres`
    }
  }),
  computed: {
    isEdit () { return !!this.$route.params.id },
    displayDate () {
      return this.form.due_date || ''
    }
  },
  created () {
    if (this.isEdit) this.fetchOne()
  },
  methods: {
    statusLabel (val) {
      const s = this.statusItems.find(i => i.value === val)
      return s ? s.title : val
    },
    statusColor (val) {
      return { pending: 'grey', doing: 'amber darken-2', done: 'green' }[val] || 'grey'
    },
    clearDueDate () {
      this.form.due_date = ''
      this.internalDate = null
    },
    applyDate (val) {
      this.form.due_date = val
      this.dueMenu = false
    },
    async fetchOne () {
      this.initialLoading = true
      try {
        const { data: task } = await api.get(`/tasks/${this.$route.params.id}`)
        this.form = {
          title: task.data.title || '',
          description: task.data.description || '',
          status: task.data.status || 'pending',
          priority: task.data.priority || 'medium',
          due_date: task.data.due_date || ''
        }
        this.internalDate = this.form.due_date || null
      } catch (e) {
        this.error = 'Não foi possível carregar a tarefa.'
      } finally {
        this.initialLoading = false
      }
    },
    async handleSubmit () {
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

<style scoped>
.text-capitalize { text-transform: capitalize; }
</style>
