<template>
  <v-card class="mb-4 elevation-0">
    <v-card-text class="py-3">
      <v-row dense align="end">
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="localFilters.search"
            label="Buscar"
            dense
            outlined
            clearable
            hide-details="auto"
            append-icon="mdi-magnify"
            @keyup.enter="emitFilter"
          />
        </v-col>

        <v-col cols="12" sm="3">
          <v-select
            :items="statusItems"
            v-model="localFilters.status"
            label="Status"
            clearable
            outlined
            dense
            hide-details="auto"
            append-icon="mdi-magnify"
            :menu-props="{ offsetY: true }"
          />
        </v-col>

        <v-col cols="12" sm="3">
          <v-select
            :items="priorityItems"
            v-model="localFilters.priority"
            label="Prioridade"
            clearable
            outlined
            dense
            hide-details="auto"
            :menu-props="{ offsetY: true }"
          />
        </v-col>

        <v-col cols="12" class="d-flex align-center justify-end mt-1">
          <v-btn small depressed color="primary" class="mr-2" @click="emitFilter">
            <v-icon left small>mdi-filter-variant</v-icon>
            Filtrar
          </v-btn>

          <v-btn small color="primary" depressed :to="{ name: newTaskRouteName }">
            <v-icon left small>mdi-plus</v-icon>
            Nova Tarefa
          </v-btn>

          <v-btn
            small
            depressed
            color="primary"
            class="ml-2"
            @click="$emit('export')"
            :loading="exporting"
          >
            <v-icon left small>mdi-download</v-icon>
            Exportar CSV
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'TaskFiltersBar',
  props: {
    filters: { type: Object, required: true },
    statusItems: { type: Array, required: true },
    priorityItems: { type: Array, required: true },
    exporting: { type: Boolean, default: false },
    newTaskRouteName: { type: String, default: 'task-new' }
  },
  computed: {
    localFilters: {
      get() { return this.filters },
      set(v) { this.$emit('update:filters', v) }
    }
  },
  methods: {
    emitFilter() {
      this.$emit('filter')
    }
  }
}
</script>
