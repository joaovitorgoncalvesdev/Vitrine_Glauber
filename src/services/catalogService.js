import { boxes, categories, products } from '../data/catalog'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export async function fetchCatalog() {
  await new Promise((resolve) => window.setTimeout(resolve, 350))
  return clone({ boxes, categories, products })
}

