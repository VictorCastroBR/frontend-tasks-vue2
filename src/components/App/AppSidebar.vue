<template>
  <v-navigation-drawer
    v-model="internal"
    app
    width="280"
    class="app-sidebar elevation-1"
  >
    <div class="brand px-4 d-flex align-center">
      <div class="brand-mark d-flex align-center justify-center mr-3">
        <v-icon size="20">mdi-check</v-icon>
      </div>
      <div class="brand-text">
        <div class="brand-title">Tarefas</div>
        <div class="brand-sub">organize seu dia</div>
      </div>
      <v-spacer />
    </div>

    <v-divider class="mx-4 my-2" />

    <v-list dense class="py-2">
      <v-list-item
        v-for="it in items"
        :key="it.title"
        :to="it.to"
        :target="it.target"
        :exact="it.exact !== false"
        link
        class="nav-item px-3"
        :class="{ active: isActive(it) }"
      >
        <v-list-item-action class="mr-3">
          <div class="icon-wrap">
            <v-icon size="20">{{ it.icon }}</v-icon>
          </div>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title class="nav-title">
            {{ it.title }}
          </v-list-item-title>
        </v-list-item-content>

        <v-spacer />

        <v-chip
          v-if="it.badge"
          x-small
          label
          class="nav-badge"
        >
          {{ it.badge }}
        </v-chip>
      </v-list-item>
    </v-list>

    <v-divider class="mx-4 my-2" />
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'AppSidebar',
  props: {
    value: { type: Boolean, default: true },
    items: { type: Array, default: () => [] },
  },
  computed: {
    internal: {
      get() { return this.value },
      set(v) { this.$emit('input', v) },
    },
  },
  methods: {
    isActive(it) {
      if (!this.$route || !it.to) return false
      const path = typeof it.to === 'string' ? it.to : it.to.path || it.to.name || ''
      return this.$route.path === path || this.$route.path.startsWith(path + '/')
    },
  },
}
</script>

<style scoped>
.app-sidebar {
  background: linear-gradient(180deg, #ffffff 0%, #fafbff 100%);
  border-right: 1px solid #eef0f5;
}

.brand {
  height: 64px;
}

.brand-mark {
  height: 36px;
  width: 36px;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-secondary-base));
  box-shadow:
    0 6px 14px -6px rgba(0, 0, 0, 0.18),
    0 0 0 0px color-mix(in srgb, var(--v-primary-base) 35%, transparent);
}

.brand-title {
  font-weight: 800;
  letter-spacing: 0.2px;
  color: #1f2937;
}
.brand-sub {
  font-size: 11px;
  color: #6b7280;
  margin-top: -2px;
}

.nav-item {
  border-radius: 12px;
  margin: 4px 12px;
  transition: background 160ms ease, transform 120ms ease, box-shadow 160ms ease;
}

.nav-item:hover {
  background: rgba(51, 102, 255, 0.08);
  background: color-mix(in srgb, var(--v-primary-base) 12%, transparent);
}

.nav-item:active {
  transform: translateY(1px);
}

.nav-item.active {
  background: color-mix(in srgb, var(--v-primary-base) 16%, transparent);
  position: relative;
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--v-primary-base) 18%, transparent);
}

.nav-item.active .icon-wrap {
  background: linear-gradient(135deg, var(--v-primary-base), var(--v-secondary-base));
  color: #fff;
}

.icon-wrap {
  height: 32px;
  width: 32px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--v-primary-base) 20%, #ffffff);
  color: var(--v-primary-base);
  transition: background 160ms ease, color 160ms ease;
}

.nav-title {
  font-weight: 600;
  color: #1f2937;
}

.nav-badge {
  background: color-mix(in srgb, var(--v-primary-base) 10%, #ffffff) !important;
  color: var(--v-primary-base) !important;
  border-radius: 999px !important;
  font-weight: 600;
}

.sr-only { position:absolute; left:-9999px; width:1px; height:1px; overflow:hidden; }
</style>
