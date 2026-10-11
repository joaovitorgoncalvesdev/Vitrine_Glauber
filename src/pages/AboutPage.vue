<script setup>
import { usePageMeta } from '../composables/usePageMeta'
usePageMeta({ title: 'Sobre o projeto', description: 'Conheça a proposta da Vitrine Glauber e sua conexão com o Centro Cultural Glauber Rocha.' })
</script>

<template><q-page class="content-page"><header class="content-hero page-container"><h1>Uma vitrine para descobrir antes de visitar.</h1><p>A Vitrine Glauber conecta visitantes aos empreendedores e produtos presentes no Centro Cultural Glauber Rocha.</p></header><section class="content-section page-container"><div><h2>Encontrar e conhecer</h2><p>O site organiza informações sobre boxes, produtos e pessoas para facilitar a descoberta. A experiência continua presencialmente, no contato direto com cada expositor.</p></div><div><h2>Sem intermediação</h2><p>A Vitrine Glauber não possui carrinho, checkout ou pagamento. Disponibilidade, compra, entrega e retirada são combinadas diretamente com o responsável por cada box.</p></div><div><h2>Cultura e economia local</h2><p>Cada perfil apresenta um pouco do trabalho e da trajetória de quem participa do centro cultural, ampliando a visibilidade da produção local.</p></div></section><div class="content-cta page-container"><q-btn color="primary" unelevated no-caps label="Conhecer os boxes" to="/boxes" /><q-btn outline color="secondary" no-caps label="Planejar uma visita" to="/visite" /></div></q-page></template>

