<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const route = useRoute()
const menuOpen = ref(false)
const accessibilityOpen = ref(false)
const voiceOpen = ref(false)
const fontScale = ref(1)
const highContrast = ref(false)
const readingMode = ref(false)
const reduceMotion = ref(false)
const announcement = ref('')
const speechSupported = ref(false)
const isSpeaking = ref(false)
const isPaused = ref(false)
const speechRate = ref(1)
const voices = ref([])
const selectedVoiceName = ref('')
const readingItems = ref([])
const currentReadingIndex = ref(0)
let speechSession = 0
const isDark = computed(() => $q.dark.isActive)
const voiceOptions = computed(() => voices.value.map((voice) => voice.name))
const currentReadingText = computed(() => readingItems.value[currentReadingIndex.value]?.text || '')
const readingProgress = computed(() => readingItems.value.length ? Math.round(((currentReadingIndex.value + 1) / readingItems.value.length) * 100) : 0)
const logo = computed(() => '/brand/logo-vitrine-glauber.svg')
const nav = [{ label: 'Início', to: '/' }, { label: 'Boxes', to: '/boxes' }, { label: 'Produtos', to: '/produtos' }, { label: 'Como visitar', to: '/visite' }]
function isCurrent(to) { return to === '/' ? route.path === '/' : route.path.startsWith(to) }
function apply() {
  document.documentElement.style.setProperty('--user-font-scale', String(fontScale.value))
  document.documentElement.classList.toggle('high-contrast', highContrast.value)
  document.documentElement.classList.toggle('reading-mode', readingMode.value)
  document.documentElement.classList.toggle('reduce-motion', reduceMotion.value)
  localStorage.setItem('vg-accessibility', JSON.stringify({ fontScale: fontScale.value, highContrast: highContrast.value, readingMode: readingMode.value, reduceMotion: reduceMotion.value, dark: $q.dark.isActive }))
  announcement.value = `Preferências aplicadas. Texto em ${Math.round(fontScale.value * 100)} por cento.`
}
function toggleDark() { $q.dark.toggle(); apply() }
function resetAccessibility() { fontScale.value = 1; highContrast.value = false; readingMode.value = false; reduceMotion.value = false; $q.dark.set(false); apply(); announcement.value = 'Preferências de acessibilidade restauradas.' }
function loadVoices() {
  voices.value = window.speechSynthesis?.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith('pt')) || []
  if (!selectedVoiceName.value && voices.value.length) selectedVoiceName.value = (voices.value.find((voice) => voice.lang.toLowerCase() === 'pt-br') || voices.value[0]).name
}
function readableText(element) {
  const clone = element.cloneNode(true)
  clone.querySelectorAll('.q-icon,script,style,[aria-hidden="true"]').forEach((item) => item.remove())
  return clone.textContent.replace(/\s+/g, ' ').trim()
}
function collectReadingItems() {
  const main = document.getElementById('conteudo-principal')
  if (!main) return []
  const selectors = 'h1,h2,h3,p,li,.box-meta,.detail-price,.visit-details'
  const items = [...main.querySelectorAll(selectors)].filter((element) => element.offsetParent !== null).map((element) => ({ element, text: readableText(element) })).filter((item, index, all) => item.text.length > 1 && item.text !== all[index - 1]?.text)
  return items
}
function clearReadingHighlight() { document.querySelectorAll('.voice-reading-active').forEach((element) => element.classList.remove('voice-reading-active')) }
function highlightCurrent() {
  clearReadingHighlight()
  const element = readingItems.value[currentReadingIndex.value]?.element
  if (!element) return
  element.classList.add('voice-reading-active')
  element.scrollIntoView({ behavior: reduceMotion.value ? 'auto' : 'smooth', block: 'center' })
}
function speakCurrent() {
  const item = readingItems.value[currentReadingIndex.value]
  if (!speechSupported.value || !item) return
  const session = ++speechSession
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(item.text)
  utterance.lang = 'pt-BR'
  utterance.rate = speechRate.value
  utterance.pitch = 1
  utterance.voice = voices.value.find((voice) => voice.name === selectedVoiceName.value) || null
  utterance.onstart = () => { if (session !== speechSession) return; isSpeaking.value = true; isPaused.value = false; highlightCurrent() }
  utterance.onend = () => {
    if (session !== speechSession) return
    if (currentReadingIndex.value < readingItems.value.length - 1) { currentReadingIndex.value += 1; speakCurrent() }
    else { isSpeaking.value = false; isPaused.value = false; clearReadingHighlight(); announcement.value = 'Leitura da página concluída.' }
  }
  utterance.onerror = (event) => { if (session !== speechSession || event.error === 'canceled' || event.error === 'interrupted') return; isSpeaking.value = false; isPaused.value = false; clearReadingHighlight(); announcement.value = 'Não foi possível concluir a leitura.' }
  window.speechSynthesis.speak(utterance)
}
function readPage() {
  if (!speechSupported.value) return
  readingItems.value = collectReadingItems()
  if (!readingItems.value.length) { announcement.value = 'Não há conteúdo disponível para leitura nesta página.'; return }
  currentReadingIndex.value = 0
  voiceOpen.value = false
  announcement.value = 'Leitura da página iniciada.'
  speakCurrent()
}
function togglePause() {
  if (!isSpeaking.value) return
  if (window.speechSynthesis.paused) { window.speechSynthesis.resume(); isPaused.value = false; announcement.value = 'Leitura retomada.' }
  else { window.speechSynthesis.pause(); isPaused.value = true; announcement.value = 'Leitura pausada.' }
}
function stopReading() { speechSession += 1; if (speechSupported.value) window.speechSynthesis.cancel(); isSpeaking.value = false; isPaused.value = false; clearReadingHighlight(); announcement.value = 'Leitura interrompida.' }
function moveReading(step) {
  if (!readingItems.value.length) return
  speechSession += 1
  window.speechSynthesis.cancel()
  currentReadingIndex.value = Math.min(readingItems.value.length - 1, Math.max(0, currentReadingIndex.value + step))
  speakCurrent()
  announcement.value = `Trecho ${currentReadingIndex.value + 1} de ${readingItems.value.length}.`
}
function restartCurrent() { if (isSpeaking.value) speakCurrent(); localStorage.setItem('vg-speech-rate', String(speechRate.value)) }
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem('vg-accessibility') || '{}')
    fontScale.value = saved.fontScale ?? 1; highContrast.value = saved.highContrast ?? false; readingMode.value = saved.readingMode ?? false; reduceMotion.value = saved.reduceMotion ?? false; $q.dark.set(saved.dark ?? false)
  } catch { $q.dark.set('auto') }
  apply()
  speechSupported.value = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
  speechRate.value = Number(localStorage.getItem('vg-speech-rate')) || 1
  if (speechSupported.value) { loadVoices(); window.speechSynthesis.onvoiceschanged = loadVoices }
})
watch([fontScale, highContrast, readingMode, reduceMotion], apply)
watch(() => route.fullPath, () => { stopReading(); voiceOpen.value = false; menuOpen.value = false })
onBeforeUnmount(() => { if (speechSupported.value) window.speechSynthesis.onvoiceschanged = null; stopReading() })
</script>

<template>
  <q-layout view="hHh lpR fff" class="site-shell">
    <a href="#conteudo-principal" class="skip-link">Pular para o conteúdo</a>
    <q-header class="site-header"><q-toolbar class="site-toolbar page-container">
      <router-link to="/" class="brand-link" aria-label="Vitrine Glauber, página inicial"><img :src="logo" alt="Vitrine Glauber" class="brand-logo" /></router-link>
      <nav class="desktop-nav" aria-label="Navegação principal"><router-link v-for="item in nav" :key="item.label" :to="item.to" class="nav-link" :aria-current="isCurrent(item.to) ? 'page' : undefined">{{ item.label }}</router-link></nav>
      <div class="header-actions"><q-btn class="accessibility-header-button" flat round icon="accessibility_new" aria-label="Abrir opções de acessibilidade" @click="accessibilityOpen = true" /><q-btn class="lt-md" flat round icon="menu" aria-label="Abrir menu" @click="menuOpen = true" /></div>
    </q-toolbar></q-header>
    <q-drawer v-model="menuOpen" side="right" overlay bordered class="mobile-drawer"><div class="drawer-head"><strong>Navegação</strong><q-btn flat round icon="close" aria-label="Fechar menu" @click="menuOpen = false" /></div><q-list padding><q-item v-for="item in nav" :key="item.label" clickable :to="item.to" :active="isCurrent(item.to)" active-class="mobile-nav-active" @click="menuOpen = false"><q-item-section>{{ item.label }}</q-item-section></q-item></q-list></q-drawer>
    <q-dialog v-model="accessibilityOpen" position="bottom"><q-card class="accessibility-card"><q-card-section class="dialog-heading"><div><h2>Acessibilidade</h2><p>Personalize a leitura e o movimento.</p></div><q-btn flat round icon="close" aria-label="Fechar opções de acessibilidade" v-close-popup /></q-card-section><q-card-section class="settings-list"><div class="setting-row font-setting"><div><strong>Tamanho do texto</strong><span aria-live="polite">{{ Math.round(fontScale * 100) }}%</span></div><div><q-btn outline round icon="remove" aria-label="Diminuir tamanho do texto" :disable="fontScale <= .9" @click="fontScale = Math.max(.9, +(fontScale - .1).toFixed(1))" /><q-btn outline round icon="add" aria-label="Aumentar tamanho do texto" :disable="fontScale >= 1.3" @click="fontScale = Math.min(1.3, +(fontScale + .1).toFixed(1))" /></div></div><q-toggle v-model="highContrast" label="Aumentar contraste" color="primary" /><q-toggle v-model="readingMode" label="Modo de leitura confortável" color="primary" /><q-toggle v-model="reduceMotion" label="Reduzir animações" color="primary" /><q-toggle :model-value="isDark" label="Modo escuro" color="primary" @update:model-value="toggleDark" /><q-btn class="reset-accessibility" flat no-caps icon="restart_alt" label="Restaurar preferências" @click="resetAccessibility" /><router-link to="/acessibilidade" class="accessibility-help" @click="accessibilityOpen = false">Saiba mais sobre acessibilidade</router-link></q-card-section></q-card></q-dialog>
    <q-dialog v-model="voiceOpen" position="bottom"><q-card class="accessibility-card voice-card"><q-card-section class="dialog-heading"><div><h2>Leitura em voz</h2><p>Ouça o conteúdo principal, trecho por trecho.</p></div><q-btn flat round icon="close" aria-label="Fechar leitura em voz" v-close-popup /></q-card-section><q-card-section class="voice-tools"><section aria-labelledby="leitura-titulo"><div class="voice-tool-heading"><q-icon name="record_voice_over" /><div><h3 id="leitura-titulo">Ouvir esta página</h3><p>O trecho atual será destacado e acompanhado automaticamente.</p></div></div><p v-if="!speechSupported" class="feature-warning">A leitura em voz não é compatível com este navegador.</p><template v-else><div class="voice-preferences"><q-select v-if="voiceOptions.length > 1" v-model="selectedVoiceName" :options="voiceOptions" outlined dense options-dense label="Voz em português" /><label class="rate-control"><span><strong>Velocidade</strong><output>{{ speechRate.toFixed(2).replace('.', ',') }}×</output></span><q-slider v-model="speechRate" :min=".75" :max="1.25" :step=".05" label color="primary" aria-label="Velocidade da leitura" @change="restartCurrent" /></label></div><div v-if="isSpeaking" class="voice-current"><span>Trecho {{ currentReadingIndex + 1 }} de {{ readingItems.length }} · {{ readingProgress }}%</span><p>{{ currentReadingText }}</p></div><div class="voice-actions"><q-btn v-if="!isSpeaking" color="primary" unelevated no-caps icon="play_arrow" label="Iniciar leitura" @click="readPage" /><template v-else><q-btn flat round icon="skip_previous" aria-label="Ler trecho anterior" :disable="currentReadingIndex === 0" @click="moveReading(-1)" /><q-btn color="primary" unelevated no-caps :icon="isPaused ? 'play_arrow' : 'pause'" :label="isPaused ? 'Continuar' : 'Pausar'" @click="togglePause" /><q-btn flat round icon="skip_next" aria-label="Ler próximo trecho" :disable="currentReadingIndex >= readingItems.length - 1" @click="moveReading(1)" /><q-btn outline color="secondary" no-caps icon="stop" label="Parar" @click="stopReading" /></template></div></template></section></q-card-section></q-card></q-dialog>
    <div class="floating-accessibility" aria-label="Atalhos de acessibilidade"><q-btn round color="primary" icon="accessibility_new" aria-label="Abrir opções de acessibilidade" @click="accessibilityOpen = true"><q-tooltip anchor="center left" self="center right">Acessibilidade</q-tooltip></q-btn><q-btn round color="secondary" icon="record_voice_over" aria-label="Abrir leitura em voz" @click="voiceOpen = true"><q-tooltip anchor="center left" self="center right">Leitura em voz</q-tooltip></q-btn></div>
    <aside v-if="isSpeaking" class="reading-controller" aria-label="Controles da leitura em voz"><button type="button" class="reading-status" @click="voiceOpen = true"><span>Lendo {{ currentReadingIndex + 1 }}/{{ readingItems.length }}</span><strong>{{ currentReadingText }}</strong><i :style="{ width: `${readingProgress}%` }"></i></button><q-btn flat round :icon="isPaused ? 'play_arrow' : 'pause'" :aria-label="isPaused ? 'Continuar leitura' : 'Pausar leitura'" @click="togglePause" /><q-btn flat round icon="skip_next" aria-label="Próximo trecho" :disable="currentReadingIndex >= readingItems.length - 1" @click="moveReading(1)" /><q-btn flat round icon="close" aria-label="Parar leitura" @click="stopReading" /></aside>
    <p class="sr-only" aria-live="polite">{{ announcement }}</p>
    <q-page-container id="conteudo-principal" tabindex="-1"><router-view /></q-page-container>
    <nav class="mobile-bottom-nav" aria-label="Navegação principal para celular"><router-link to="/" :aria-current="isCurrent('/') ? 'page' : undefined"><q-icon name="home" /><span>Início</span></router-link><router-link to="/boxes" :aria-current="isCurrent('/boxes') ? 'page' : undefined"><q-icon name="storefront" /><span>Boxes</span></router-link><router-link to="/produtos" :aria-current="isCurrent('/produtos') ? 'page' : undefined"><q-icon name="shopping_bag" /><span>Produtos</span></router-link><router-link to="/visite" :aria-current="isCurrent('/visite') ? 'page' : undefined"><q-icon name="location_on" /><span>Visitar</span></router-link></nav>
    <footer class="site-footer"><div class="page-container footer-grid"><div><img src="/brand/logo-vitrine-glauber.svg" alt="Vitrine Glauber" class="footer-logo" /><p>Uma porta aberta para quem produz, cria e movimenta o Centro Cultural Glauber Rocha.</p></div><div><h2>Visite</h2><p>Vitória da Conquista, Bahia</p><router-link to="/visite">Informações para sua visita</router-link></div><div><h2>Acesso rápido</h2><router-link to="/boxes">Todos os boxes</router-link><router-link to="/produtos">Todos os produtos</router-link><router-link to="/sobre">Sobre o projeto</router-link><router-link to="/acessibilidade">Acessibilidade</router-link><router-link to="/privacidade">Privacidade</router-link></div></div><div class="page-container footer-bottom"><span>Projeto demonstrativo de interface</span><span>Centro Cultural Glauber Rocha</span></div></footer>
  </q-layout>
</template>
