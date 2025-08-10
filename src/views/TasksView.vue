<template>
  <div>
    <v-card class="mb-4">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="4">
            <v-select :items="statusItems" v-model="filters.status" label="Status" clearable dense />
          </v-col>
          <v-col cols="12" sm="4">
            <v-select :items="priorityItems" v-model="filters.priority" label="Prioridade" clearable dense />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="filters.search" label="Buscar" dense clearable />
          </v-col>
        </v-row>
        <v-btn color="primary" class="mr-2" @click="fetchTasks">Filtrar</v-btn>
        <v-btn color="secondary" :to="{ name:'task-new' }">Nova Tarefa</v-btn>
        <v-btn color="success" class="ml-2" @click="exportTasks" :loading="exporting">Exportar CSV</v-btn>
      </v-card-text>
    </v-card>

    <v-card>
      <v-simple-table>
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
            <td><v-chip x-small :color="statusColor(t.status)" dark>{{ t.status }}</v-chip></td>
            <td><v-chip x-small>{{ t.priority }}</v-chip></td>
            <td>{{ t.due_date || '-' }}</td>
            <td>{{ t.user?.name }}</td>
            <td>
              <v-btn x-small text color="green" @click="complete(t)" v-if="t.status!=='done'">Concluir</v-btn>
              <v-btn x-small text color="primary" :to="{ name:'task-edit', params:{ id:t.id } }">Editar</v-btn>
              <v-btn x-small text color="red" @click="remove(t)">Excluir</v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-card-actions>
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

export default {
  data: () => ({
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
      this.tasks = [...tasks.data] || [];
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
        const exportId = data.export.id

        this.exportStatus = 'queued'

        this.exportInterval = setInterval(async () => {
          const { data: statusResp } = await api.get(`/exports/${exportId}`)
          this.exportStatus = statusResp.status
          if (statusResp.status === 'done') {
            clearInterval(this.exportInterval)
            await this.downloadExport(statusResp.id)
            this.exporting = false
          }
          if (statusResp.status === 'failed') {
            clearInterval(this.exportInterval)
            alert('Falha ao gerar exportação.')
            this.exporting = false
          }
        }, 2000)
      } catch (e) {
        console.error(e)
        alert('Erro ao solicitar exportação.')
        this.exporting = false
      }
    }
  }
}
</script>
