<script setup>
import { computed, onMounted } from 'vue'
import { useCatalogStore } from '../stores/catalog'
import { usePageMeta } from '../composables/usePageMeta'
import { useShare } from '../composables/useShare'
import ProductCard from '../components/ProductCard.vue'
import CatalogState from '../components/CatalogState.vue'
import NotFoundPage from './NotFoundPage.vue'

const props = defineProps({ slug: String })
const catalog = useCatalogStore()
const { share } = useShare()
const box = computed(() => catalog.boxBySlug(props.slug))
const items = computed(() => box.value ? catalog.productsByBox(box.value.id) : [])
usePageMeta(() => box.value && ({ title: box.value.name, description: box.value.description, image: box.value.image }))
onMounted(() => catalog.loadCatalog())
</script>

<template><q-page v-if="catalog.loading || catalog.error" class="listing-page page-container"><CatalogState :loading="catalog.loading" :error="catalog.error" @retry="catalog.loadCatalog({ force: true })" /></q-page><q-page v-else-if="box" class="box-page"><section class="box-profile-hero page-container"><img :src="box.image" :alt="`Produtos do ${box.name}`" class="box-profile-image" width="800" height="600" /><div class="box-profile-copy"><router-link to="/boxes" class="back-link"><q-icon name="arrow_back" /> Voltar aos boxes</router-link><div class="box-meta"><span>{{ box.number }}</span><span>{{ box.categoryLabel }}</span></div><h1>{{ box.name }}</h1><p>{{ box.description }}</p><div class="detail-actions"><q-btn color="primary" unelevated no-caps icon="chat" label="Falar pelo WhatsApp" :href="`https://wa.me/${box.whatsapp}?text=${encodeURIComponent('Olá! Encontrei seu box na Vitrine Glauber.')}`" target="_blank" rel="noopener" /><q-btn outline color="secondary" no-caps icon="share" label="Compartilhar" @click="share({ title: box.name, text: box.description })" /></div></div></section><section class="box-about page-container"><div class="maker-card"><img :src="box.avatar" :alt="box.owner" width="150" height="150" /><div><span>Quem faz</span><h2>{{ box.owner }}</h2><p>{{ box.story }}</p></div></div><div class="box-visit-info"><div><q-icon name="schedule" /><span><strong>Horários</strong>{{ box.hours }}</span></div><div><q-icon name="location_on" /><span><strong>Localização</strong>{{ box.location }}</span></div></div></section><section class="box-products page-container"><div class="section-heading"><h2>Produtos deste box</h2><p>Consulte valores e disponibilidade antes da visita.</p></div><div v-if="items.length" class="product-grid"><ProductCard v-for="product in items" :key="product.id" :product="product" /></div><div v-else class="state-panel"><h2>Catálogo em preparação</h2><p>Este expositor ainda está cadastrando seus produtos.</p></div></section></q-page><NotFoundPage v-else /></template>

