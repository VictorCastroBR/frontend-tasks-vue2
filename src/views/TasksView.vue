<template>
  <div class="page-wrap">
    <TaskFiltersBar
      :filters.sync="filters"
      :status-items="statusItems"
      :priority-items="priorityItems"
      :exporting="exporting"
      @filter="fetchTasks"
      @export="exportTasks"
    />

    <v-card class="mt-4 surface-card" flat>
      <div class="table-scroll">
        <v-simple-table dense class="minimal-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Prazo</th>
              <th>Autor</th>
              <th style="width:180px">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in tasks" :key="t.id">
              <td>{{ t.title }}</td>
              <td>
                <v-chip x-small outlined :color="statusColor(t.status)">
                  {{ t.status }}
                </v-chip>
              </td>
              <td>
                <v-chip x-small outlined>{{ t.priority }}</v-chip>
              </td>
              <td>{{ t.due_date || '-' }}</td>
              <td>{{ t.user?.name }}</td>
              <td class="actions-col">
                <v-btn x-small text color="green" @click="complete(t)" v-if="t.status!=='done'">Concluir</v-btn>
                <v-btn x-small text color="primary" :to="{ name:'task-edit', params:{ id:t.id } }">Editar</v-btn>
                <v-btn x-small text color="red" @click="remove(t)">Excluir</v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </div>

      <v-divider />

      <v-card-actions class="actions-bar">
        <v-spacer />
        <v-btn text @click="page>1 && (page--, fetchTasks())">Anterior</v-btn>
        <span class="mx-2">Página {{ page }}</span>
        <v-btn text @click="hasMore && (page++, fetchTasks())">Próxima</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import api from '@/services/api'
import TaskFiltersBar from '@/components/Tasks/TaskFiltersBar.vue'

export default {
  components: { TaskFiltersBar },
  data: () => ({
    loading: false,
    exporting: false,
    tasks: [],
    page: 1,
    perPage: 10,
    hasMore: false,
    filters: { status: null, priority: null, search: '' },
    statusItems: ['pending','doing','done'],
    priorityItems: ['low','medium','high']
  }),
  created() { this.fetchTasks() },
  methods: {
    statusColor(s) {
      return { pending:'grey', doing:'blue', done:'green' }[s] || 'grey'
    },
    async fetchTasks() {
      const params = { ...this.filters, per_page: this.perPage, page: this.page }
      const { data: tasks } = await api.get('/tasks', { params })
      this.tasks = [...tasks.data] || []
      this.hasMore = !!tasks.links && !!tasks.links.next
    },
    async complete(task) {
      await api.post(`/tasks/${task.id}/complete`)
      this.fetchTasks()
    },
    async remove(task) {
      if (!confirm('Excluir essa tarefa?')) return
      await api.delete(`/tasks/${task.id}`)
      this.fetchTasks()
    },
    async downloadExport(id) {
      try {
        const { data } = await api.get(`/exports/${id}/download`, { responseType: 'blob' })
        const blobUrl = window.URL.createObjectURL(new Blob([data]))
        const link = document.createElement('a')
        link.href = blobUrl
        link.setAttribute('download', `tasks_${new Date().toISOString().slice(0,10)}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(blobUrl)
      } catch (e) {
        alert('Falha ao baixar exportação')
      }
    },
    async exportTasks() {
      this.exporting = true
      try {
        const { data } = await api.post('/exports')
        return data
      } catch (e) {
        console.error(e)
        alert('Erro ao solicitar exportação.')
        this.exporting = false
      }
    },
    onFilter () {
      this.page = 1
      this.fetchTasks()
    },
  }
}
</script>

<style scoped>
.page-wrap {
  padding-top: 12px;
}

.surface-card {
background: #FFFFFF !important;
  border-radius: 12px;
}

.table-scroll {
  overflow-x: auto;
}

.actions-col {
  white-space: nowrap;
}

.actions-bar {
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
