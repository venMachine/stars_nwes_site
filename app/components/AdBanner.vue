<template>
  <div class="ad-banner">
    <div class="container">
      <div class="ad-placeholder">
        <p>Рекламный баннер 728×90</p>
        <small class="ad-label">Реклама</small>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.ad-banner {
  background: linear-gradient(
    135deg, 
    $secondary 0%, 
    color-mix(in srgb, $secondary, black 3%) 100%
  );
  padding: 1rem 0;
  border-top: 1px solid rgba($primary, 0.1);
  border-bottom: 1px solid rgba($primary, 0.1);
  margin: 2rem 0;
}

.ad-placeholder {
  background: rgba($primary, 0.05);
  border: 2px dashed rgba($primary, 0.3);
  border-radius: $border-radius;
  padding: 2rem;
  text-align: center;
  color: $text-secondary;
  
  p {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .ad-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    opacity: 0.6;
  }
}
</style>