import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import HomePage from '../pages/HomePage.vue'
import BoxPage from '../pages/BoxPage.vue'
import BoxesPage from '../pages/BoxesPage.vue'
import ProductsPage from '../pages/ProductsPage.vue'
import ProductPage from '../pages/ProductPage.vue'
import AboutPage from '../pages/AboutPage.vue'
import VisitPage from '../pages/VisitPage.vue'
import AccessibilityPage from '../pages/AccessibilityPage.vue'
import PrivacyPage from '../pages/PrivacyPage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'

export default createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, top: 86, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [{
    path: '/', component: MainLayout, children: [
      { path: '', component: HomePage },
      { path: 'boxes', component: BoxesPage },
      { path: 'boxes/:slug', component: BoxPage, props: true },
      { path: 'box/:slug', redirect: (to) => `/boxes/${to.params.slug}` },
      { path: 'produtos', component: ProductsPage },
      { path: 'produtos/:slug', component: ProductPage, props: true },
      { path: 'categorias/:slug', component: BoxesPage, props: (route) => ({ categorySlug: route.params.slug }) },
      { path: 'sobre', component: AboutPage },
      { path: 'visite', component: VisitPage },
      { path: 'acessibilidade', component: AccessibilityPage },
      { path: 'privacidade', component: PrivacyPage },
      { path: ':pathMatch(.*)*', component: NotFoundPage },
    ],
  }],
})
