<template>
  <v-app-bar app flat elevate-on-scroll class="app-header">
    <v-app-bar-nav-icon class="icon-btn" @click="$emit('toggle-drawer')" />

    <div class="d-none d-sm-flex align-center ml-2">
      <div class="title">{{ company || 'Dashboard' }}</div>
    </div>

    <v-spacer />

    <v-menu bottom left offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text class="user-btn" v-on="on">
          <v-avatar size="32" class="avatar">
            {{ initials(user && user.name) }}
          </v-avatar>
          <span class="user-name d-none d-md-inline ms-1">{{ user?.name }}</span>
        </v-btn>
      </template>

      <v-list dense class="menu-list">
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
      return name
        .split(' ')
        .map(p => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    }
  }
}
</script>

<style scoped>
.app-header {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding-left: 8px;
  padding-right: 8px;
}

.title {
  font-weight: 700;
  letter-spacing: 0.2px;
  color: var(--v-theme-on-surface);
  font-size: 1rem;
}

.icon-btn {
  border-radius: 8px !important;
  transition: background 0.2s ease;
}
.icon-btn:hover {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  border-radius: 8px;
  padding: 0 8px;
  text-transform: none;
}
.user-btn:hover {
  background: rgba(var(--v-theme-primary), 0.05);
}

.avatar {
  font-weight: 700;
  color: #fff !important;
  background: linear-gradient(135deg, var(--v-primary-base), #7c4dff) !important;
  box-shadow: 0 0 0 2px #fff, 0 4px 10px -4px rgba(51, 102, 255, 0.4);
}

.user-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--v-theme-on-surface);
  white-space: nowrap;
}

.menu-list {
  padding: 6px 4px;
  min-width: 180px;
}
.menu-list .v-list-item {
  border-radius: 8px;
  margin: 2px 4px;
  transition: background 140ms ease;
}
.menu-list .v-list-item:hover {
  background: rgba(17, 24, 39, 0.04);
}

.v-divider {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
</style>
