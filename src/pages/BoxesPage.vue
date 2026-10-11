<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCatalogStore } from '../stores/catalog'
import { usePageMeta } from '../composables/usePageMeta'
import BoxCard from '../components/BoxCard.vue'
import CatalogFilters from '../components/CatalogFilters.vue'
import CatalogState from '../components/CatalogState.vue'

const props = defineProps({ categorySlug: { type: String, default: '' } })
const catalog = useCatalogStore()
const route = useRoute()
const router = useRouter()
function readRoute() { catalog.query = String(route.query.busca || ''); catalog.activeCategory = props.categorySlug || String(route.query.categoria || 'todos') }
function updateRoute() { router.replace({ path: '/boxes', query: { ...(catalog.query.trim() && { busca: catalog.query.trim() }), ...(catalog.activeCategory !== 'todos' && { categoria: catalog.activeCategory }) } }) }
function clear() { catalog.clearFilters(); updateRoute() }
usePageMeta({ title: 'Todos os boxes', description: 'Encontre os boxes e empreendedores da Vitrine Glauber por nome ou categoria.' })
onMounted(() => { readRoute(); catalog.loadCatalog() })
watch(() => [route.query.busca, route.query.categoria, props.categorySlug], readRoute)
</script>

<template><q-page class="listing-page page-container"><header class="page-intro"><h1>Todos os boxes</h1><p>Conheça quem produz, cria e movimenta o Centro Cultural Glauber Rocha.</p></header><CatalogFilters :query="catalog.query" :category="catalog.activeCategory" :categories="catalog.categories" :result-count="catalog.filteredBoxes.length" result-label="boxes" @update:query="catalog.query = $event; updateRoute()" @update:category="catalog.activeCategory = $event; updateRoute()" @clear="clear" /><CatalogState :loading="catalog.loading" :error="catalog.error" :empty="!catalog.filteredBoxes.length" @retry="catalog.loadCatalog({ force: true })" @clear="clear"><div class="box-grid listing-grid"><BoxCard v-for="box in catalog.filteredBoxes" :key="box.id" :box="box" /></div></CatalogState></q-page></template>

