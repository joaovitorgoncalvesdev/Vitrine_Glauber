<script setup>
import { computed, onMounted } from 'vue'
import { useCatalogStore } from '../stores/catalog'
import { usePageMeta } from '../composables/usePageMeta'
import { useShare } from '../composables/useShare'
import CatalogState from '../components/CatalogState.vue'
import NotFoundPage from './NotFoundPage.vue'

const props = defineProps({ slug: String })
const catalog = useCatalogStore()
const { share } = useShare()
const product = computed(() => catalog.productBySlug(props.slug))
const owner = computed(() => catalog.boxes.find((box) => box.id === product.value?.boxId))
usePageMeta(() => product.value && ({ title: product.value.name, description: product.value.description, image: product.value.image }))
onMounted(() => catalog.loadCatalog())
</script>

<template><q-page v-if="catalog.loading || catalog.error" class="listing-page page-container"><CatalogState :loading="catalog.loading" :error="catalog.error" @retry="catalog.loadCatalog({ force: true })" /></q-page><q-page v-else-if="product && owner" class="product-page page-container"><router-link to="/produtos" class="back-link"><q-icon name="arrow_back" /> Voltar aos produtos</router-link><article class="product-detail"><img :src="product.image" :alt="product.name" class="product-detail-image" width="800" height="800" /><div class="product-detail-copy"><router-link :to="`/boxes/${owner.slug}`" class="detail-owner">{{ owner.name }}</router-link><h1>{{ product.name }}</h1><p>{{ product.description }}</p><div class="detail-price"><strong v-if="product.price">R$ {{ product.price.toFixed(2).replace('.', ',') }}</strong><span>Preço informado pelo expositor. Confirme disponibilidade antes da visita.</span></div><div class="detail-actions"><q-btn color="primary" unelevated no-caps icon="chat" label="Consultar no WhatsApp" :href="`https://wa.me/${owner.whatsapp}?text=${encodeURIComponent(`Olá! Vi ${product.name} na Vitrine Glauber e gostaria de saber sobre a disponibilidade.`)}`" target="_blank" rel="noopener" /><q-btn outline color="secondary" no-caps icon="share" label="Compartilhar" @click="share({ title: product.name, text: product.description })" /></div><small>A Vitrine Glauber não realiza pagamentos ou entregas. A combinação é feita diretamente com o expositor.</small></div></article></q-page><NotFoundPage v-else /></template>

