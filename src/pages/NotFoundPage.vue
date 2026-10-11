<script setup>
import { usePageMeta } from '../composables/usePageMeta'
usePageMeta({ title: 'Página não encontrada', description: 'O endereço acessado não está disponível.' })
</script>
<template><q-page class="not-found page-container"><q-icon name="explore_off" size="56px" /><h1>Página não encontrada</h1><p>O endereço pode ter mudado ou ainda não está disponível.</p><q-btn color="primary" unelevated no-caps label="Voltar ao início" to="/" /></q-page></template>

