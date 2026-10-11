import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchCatalog } from '../services/catalogService'

export const useCatalogStore = defineStore('catalog', () => {
  const boxes = ref([])
  const categories = ref([])
  const products = ref([])
  const query = ref('')
  const activeCategory = ref('todos')
  const loading = ref(false)
  const loaded = ref(false)
  const error = ref('')
  const filteredBoxes = computed(() => boxes.value.filter((box) => {
    const category = activeCategory.value === 'todos' || box.category === activeCategory.value
    const text = `${box.name} ${box.owner} ${box.description} ${box.categoryLabel}`.toLocaleLowerCase('pt-BR')
    return category && (!query.value.trim() || text.includes(query.value.trim().toLocaleLowerCase('pt-BR')))
  }))
  const filteredProducts = computed(() => products.value.filter((product) => {
    const category = activeCategory.value === 'todos' || product.category === activeCategory.value
    const text = `${product.name} ${product.description}`.toLocaleLowerCase('pt-BR')
    return category && (!query.value.trim() || text.includes(query.value.trim().toLocaleLowerCase('pt-BR')))
  }))
  async function loadCatalog({ force = false } = {}) {
    if ((loaded.value && !force) || loading.value) return
    loading.value = true
    error.value = ''
    try {
      const data = await fetchCatalog()
      boxes.value = data.boxes
      categories.value = data.categories
      products.value = data.products
      loaded.value = true
    } catch {
      error.value = 'Não foi possível carregar a vitrine agora.'
    } finally {
      loading.value = false
    }
  }
  function clearFilters() { query.value = ''; activeCategory.value = 'todos' }
  return {
    boxes, categories, products, query, activeCategory, loading, loaded, error,
    filteredBoxes, filteredProducts, loadCatalog, clearFilters,
    boxBySlug: (slug) => boxes.value.find((box) => box.slug === slug),
    productBySlug: (slug) => products.value.find((product) => product.slug === slug),
    productsByBox: (id) => products.value.filter((product) => product.boxId === id),
  }
})
