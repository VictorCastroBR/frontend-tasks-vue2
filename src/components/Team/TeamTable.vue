<template>
  <v-simple-table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>E-mail</th>
        <th>Admin</th>
        <th style="width:140px;">Ações</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="!loading && users.length">
        <tr v-for="u in users" :key="u.id">
          <td>{{ u.name }}</td>
          <td>{{ u.email }}</td>
          <td>{{ u.is_admin ? 'Sim' : 'Não' }}</td>
          <td class="d-flex">
            <v-btn icon small class="mr-1" @click="$emit('edit', u)">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small class="mr-1" @click="$emit('change-password', u)">
              <v-icon small>mdi-key-variant</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
      
      <template v-else-if="loading">
        <tr v-for="i in 5" :key="i">
          <td colspan="4">
            <v-skeleton-loader type="list-item"></v-skeleton-loader>
          </td>
        </tr>
      </template>

      <tr v-else>
        <td colspan="4" class="text-center grey--text">Nenhum usuário encontrado</td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
export default {
  name: 'TeamTable',
  props: {
    users: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },
}
</script>
