<script setup>
import { computed } from 'vue'

const props = defineProps({
  query: { type: String, default: '' },
  category: { type: String, default: 'todos' },
  categories: { type: Array, default: () => [] },
  resultCount: { type: Number, default: 0 },
  resultLabel: { type: String, default: 'resultados' },
})
const emit = defineEmits(['update:query', 'update:category', 'clear'])
const hasFilters = computed(() => Boolean(props.query.trim()) || props.category !== 'todos')
</script>

<template>
  <div class="catalog-filters">
    <q-input :model-value="query" outlined label="Buscar na vitrine" clearable @update:model-value="emit('update:query', $event || '')">
      <template #prepend><q-icon name="search" /></template>
    </q-input>
    <div class="category-scroll" aria-label="Filtrar por categoria">
      <q-btn v-for="item in categories" :key="item.id" :outline="category !== item.id" :unelevated="category === item.id" :color="category === item.id ? 'primary' : 'secondary'" no-caps :icon="item.icon" :label="item.label" :aria-pressed="category === item.id" @click="emit('update:category', item.id)" />
    </div>
    <div class="filter-summary" aria-live="polite">
      <strong>{{ resultCount }} {{ resultCount === 1 ? resultLabel.replace(/s$/, '') : resultLabel }} encontrado{{ resultCount === 1 ? '' : 's' }}</strong>
      <q-btn v-if="hasFilters" flat no-caps icon="filter_alt_off" label="Limpar filtros" @click="emit('clear')" />
    </div>
  </div>
</template>

