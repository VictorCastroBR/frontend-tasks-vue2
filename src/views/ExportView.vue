<template>
  <v-container class="d-flex align-center justify-center" style="min-height: calc(100vh - 120px);">
    <v-card max-width="560" class="w-100 rounded-xl elevation-2">
      <v-card-text class="pa-8 text-center">
        <v-avatar size="56" class="mb-4" color="primary" tile>
          <v-icon large color="white">mdi-file-delimited-outline</v-icon>
        </v-avatar>

        <div class="text-h5 font-weight-bold mb-1">Exportar CSV</div>
        <div class="text-body-2 grey--text mb-6">
          Clique no botão abaixo para gerar e baixar o arquivo CSV.
        </div>

        <v-chip small class="mb-6" label>
          UUID: {{ exportUuid }}
        </v-chip>

        <v-alert v-if="error" type="error" dense outlined class="mb-4">
          {{ error }}
        </v-alert>

        <v-btn
          color="primary"
          class="px-6"
          depressed
          large
          :loading="loading"
          :disabled="loading"
          @click="downloadCsv"
        >
          <v-icon left>mdi-download</v-icon>
          Baixar CSV
        </v-btn>

        <v-btn text class="ml-2" :disabled="loading" @click="$router.back()">
          Voltar
        </v-btn>

        <v-progress-linear
          v-if="loading"
          indeterminate
          class="mt-6"
        />

        <div v-if="lastDownloaded" class="mt-6 text-caption grey--text">
          Último download: {{ lastDownloaded }}
        </div>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snack.open" :timeout="3000">
      {{ snack.text }}
      <v-btn text @click="snack.open = false">Fechar</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'ExportView',
  props: {
    uuid: { type: String, default: '' }
  },
  data: () => ({
    loading: false,
    error: '',
    lastDownloaded: '',
    snack: { open: false, text: '' }
  }),
  computed: {
    exportUuid () {
      return this.uuid || this.$route.params.uuid
    }
  },
  methods: {
    extractFilename (contentDisposition) {
      const match = /filename\*=UTF-8''([^;]+)|filename="?([^"]+)"?/i.exec(contentDisposition)
      try {
        if (match) {
          if (match[1]) return decodeURIComponent(match[1])
          if (match[2]) return match[2]
        }
      } catch (_) {
        console.error('Erro ao decodificar filename:', _)
      }
      return null
    },
    async downloadCsv () {
      this.error = ''
      if (!this.exportUuid) {
        this.error = 'UUID não informado.'
        return
      }
      this.loading = true
      try {
        const response = await api.get(`/exports/${this.exportUuid}/download`, {
          responseType: 'blob'
        })

        const cd = response.headers['content-disposition'] || ''
        const filename = this.extractFilename(cd) || `export-${this.exportUuid}.csv`

        const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)

        this.lastDownloaded = new Date().toLocaleString()
        this.snack = { open: true, text: 'Download iniciado!' }
      } catch (e) {
        this.error = e?.response?.data?.message || 'Não foi possível baixar o CSV.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
