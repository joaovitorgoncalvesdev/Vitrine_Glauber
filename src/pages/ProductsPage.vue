<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCatalogStore } from '../stores/catalog'
import { usePageMeta } from '../composables/usePageMeta'
import ProductCard from '../components/ProductCard.vue'
import CatalogFilters from '../components/CatalogFilters.vue'
import CatalogState from '../components/CatalogState.vue'

const catalog = useCatalogStore()
const route = useRoute()
const router = useRouter()
function readRoute() { catalog.query = String(route.query.busca || ''); catalog.activeCategory = String(route.query.categoria || 'todos') }
function updateRoute() { router.replace({ path: '/produtos', query: { ...(catalog.query.trim() && { busca: catalog.query.trim() }), ...(catalog.activeCategory !== 'todos' && { categoria: catalog.activeCategory }) } }) }
function clear() { catalog.clearFilters(); updateRoute() }
usePageMeta({ title: 'Todos os produtos', description: 'Explore os produtos divulgados pelos expositores da Vitrine Glauber.' })
onMounted(() => { readRoute(); catalog.loadCatalog() })
watch(() => [route.query.busca, route.query.categoria], readRoute)
</script>

<template><q-page class="listing-page page-container"><header class="page-intro"><h1>Todos os produtos</h1><p>Descubra produções locais e combine disponibilidade, pagamento e retirada diretamente com o expositor.</p></header><CatalogFilters :query="catalog.query" :category="catalog.activeCategory" :categories="catalog.categories" :result-count="catalog.filteredProducts.length" result-label="produtos" @update:query="catalog.query = $event; updateRoute()" @update:category="catalog.activeCategory = $event; updateRoute()" @clear="clear" /><CatalogState :loading="catalog.loading" :error="catalog.error" :empty="!catalog.filteredProducts.length" @retry="catalog.loadCatalog({ force: true })" @clear="clear"><div class="product-grid listing-grid"><ProductCard v-for="product in catalog.filteredProducts" :key="product.id" :product="product" /></div></CatalogState></q-page></template>

