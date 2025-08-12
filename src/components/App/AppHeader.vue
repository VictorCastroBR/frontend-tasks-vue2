<template>
  <v-app-bar app flat elevate-on-scroll class="app-header">
    <v-app-bar-nav-icon class="icon-btn" @click="$emit('toggle-drawer')" />

    <div class="d-none d-sm-flex align-center ml-2">
      <div class="title">{{ company || 'Dashboard' }}</div>
    </div>

    <v-spacer />

    <v-menu bottom left>
      <template v-slot:activator="{ on }">
        <v-btn icon class="icon-btn" v-on="on">
          <v-avatar size="32" class="avatar">
            {{ initials(user && user.name) }}
          </v-avatar>
        </v-btn>
      </template>

      <v-list dense class="menu-list">
        <v-list-item>
          <v-list-item-title>Meu Perfil</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Configurações</v-list-item-title>
        </v-list-item>
        <v-divider class="my-1" />
        <v-list-item @click="$emit('logout')">
          <v-list-item-title class="red--text text--darken-1">
            Sair
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    user: { type: Object, default: () => null },
    company: { type: String, default: '' }
  },
  methods: {
    initials(name = '') {
      return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
    }
  }
}
</script>

<style scoped>
.app-header {
  background: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: saturate(180%) blur(8px);
  border-bottom: 1px solid var(--v-theme-on-surface-variant);
}

.title {
  font-weight: 800;
  letter-spacing: 0.2px;
  color: var(--v-theme-on-surface);
}

.icon-btn {
  border-radius: 10px !important;
}
.icon-btn:hover {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}

.avatar {
  font-weight: 800;
  color: #fff !important;
  background: linear-gradient(135deg, var(--v-primary-base), #7c4dff) !important;
  box-shadow: 0 0 0 2px #fff,
              0 6px 14px -6px rgba(51, 102, 255, 0.45);
}

.menu-list {
  padding: 6px 4px;
  min-width: 180px;
}
.menu-list .v-list-item {
  border-radius: 10px;
  margin: 2px 4px;
  transition: background 140ms ease;
}
.menu-list .v-list-item:hover {
  background: rgba(17, 24, 39, 0.04);
}

.v-divider {
  border-color: var(--v-theme-on-surface-variant) !important;
}
</style>
