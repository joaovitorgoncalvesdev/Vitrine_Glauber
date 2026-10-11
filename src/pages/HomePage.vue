<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalogStore } from '../stores/catalog'
import { usePageMeta } from '../composables/usePageMeta'
import BoxCard from '../components/BoxCard.vue'
import ProductCard from '../components/ProductCard.vue'
import CatalogState from '../components/CatalogState.vue'
import HomeHero from '../components/HomeHero.vue'
import HomeStory from '../components/HomeStory.vue'
import HomeVisit from '../components/HomeVisit.vue'

const catalog = useCatalogStore()
const router = useRouter()
const search = ref('')
const featuredBoxes = computed(() => catalog.boxes.slice(0, 3))
const featuredProducts = computed(() => catalog.products.slice(0, 4))
function submitSearch() { router.push({ path: '/boxes', query: search.value.trim() ? { busca: search.value.trim() } : {} }) }
usePageMeta({ description: 'Descubra boxes, produtos e empreendedores do Centro Cultural Glauber Rocha em Vitória da Conquista.' })
onMounted(() => catalog.loadCatalog())
</script>

<template><q-page>
  <HomeHero />
  <section class="discovery-section page-container"><nav class="catalog-portals" aria-label="Explorar a vitrine"><router-link to="/boxes" class="catalog-portal catalog-portal-boxes"><q-icon name="storefront" /><span><strong>Conhecer os boxes</strong><small>Histórias, contatos e localização</small></span><q-icon name="arrow_forward" /></router-link><router-link to="/produtos" class="catalog-portal catalog-portal-products"><q-icon name="shopping_bag" /><span><strong>Descobrir produtos</strong><small>Artesanato, sabores, moda e bem-estar</small></span><q-icon name="arrow_forward" /></router-link></nav><div class="search-panel"><div><h2>Encontre um box</h2><p>Busque pelo nome, produto ou por quem faz.</p></div><q-form class="home-search" @submit.prevent="submitSearch"><q-input v-model="search" outlined label="Buscar boxes"><template #prepend><q-icon name="search" /></template><template #append><q-btn flat round type="submit" icon="arrow_forward" aria-label="Buscar boxes" /></template></q-input></q-form></div><nav class="category-scroll" aria-label="Categorias de boxes"><q-btn v-for="category in catalog.categories.filter((item) => item.id !== 'todos')" :key="category.id" outline color="secondary" no-caps :icon="category.icon" :label="category.label" :to="{ path: '/boxes', query: { categoria: category.id } }" /></nav></section>
  <section class="catalog-section page-container"><div class="section-heading section-heading-action"><div><h2>Boxes para conhecer</h2><p>Uma seleção de negócios locais para descobrir antes da visita.</p></div><q-btn outline color="primary" no-caps label="Ver todos os boxes" to="/boxes" /></div><CatalogState :loading="catalog.loading" :error="catalog.error" :empty="!featuredBoxes.length" @retry="catalog.loadCatalog({ force: true })"><div class="box-grid"><BoxCard v-for="box in featuredBoxes" :key="box.id" :box="box" /></div></CatalogState></section>
  <section class="products-section page-container"><div class="section-heading section-heading-action"><div><h2>Produtos em destaque</h2><p>Valores e disponibilidade são confirmados diretamente com o expositor.</p></div><q-btn outline color="primary" no-caps label="Ver todos os produtos" to="/produtos" /></div><CatalogState :loading="catalog.loading" :error="catalog.error" :empty="!featuredProducts.length" @retry="catalog.loadCatalog({ force: true })"><div class="product-grid"><ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" /></div></CatalogState></section>
  <HomeStory />
  <HomeVisit />
</q-page></template>

