<template>
  <section class="hero-section">
    <div class="hero-orb" aria-hidden="true"></div>
    <div class="page-container hero-layout">
      <div class="hero-content">
        <span class="hero-eyebrow">Centro Cultural Glauber Rocha</span>
        <h1>Entre. <em>Descubra.</em> Encontre.</h1>
        <p>Uma porta aberta para conhecer os boxes, os produtos e as pessoas que fazem o Glauber acontecer.</p>
        <div class="hero-actions">
          <q-btn color="primary" unelevated no-caps label="Explorar boxes" to="/boxes" icon-right="arrow_forward" />
          <q-btn class="hero-secondary" outline no-caps label="Ver produtos" to="/produtos" icon-right="arrow_forward" />
        </div>
      </div>
      <div class="hero-art">
        <span class="hero-block hero-block-yellow" aria-hidden="true"></span>
        <span class="hero-block hero-block-pink" aria-hidden="true"></span>
        <div class="hero-stamp"><q-icon name="location_on" /><span>Feito em<br />Conquista</span></div>
        <img src="/images/hero-feira-cultural.png" alt="Artesãos e visitantes em uma feira no centro cultural" class="hero-image" fetchpriority="high" width="1600" height="1000" />
      </div>
    </div>
  </section>
</template>

