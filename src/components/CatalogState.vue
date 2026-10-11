<script setup>
defineProps({ loading: Boolean, error: { type: String, default: '' }, empty: Boolean })
defineEmits(['retry', 'clear'])
</script>

<template>
  <div v-if="loading" class="box-grid" aria-busy="true" aria-label="Carregando catálogo">
    <q-card v-for="n in 4" :key="n" flat class="skeleton-card"><q-skeleton height="230px" square /><q-card-section><q-skeleton type="text" width="65%" /><q-skeleton type="text" /></q-card-section></q-card>
  </div>
  <div v-else-if="error" class="state-panel" role="alert">
    <q-icon name="cloud_off" size="40px" /><h2>A vitrine não carregou</h2><p>{{ error }}</p><q-btn color="primary" unelevated no-caps icon="refresh" label="Tentar novamente" @click="$emit('retry')" />
  </div>
  <div v-else-if="empty" class="state-panel">
    <q-icon name="search_off" size="40px" /><h2>Nenhum resultado encontrado</h2><p>Tente outro termo ou limpe os filtros.</p><q-btn color="primary" unelevated no-caps label="Limpar filtros" @click="$emit('clear')" />
  </div>
  <slot v-else />
</template>

