<template>
  <div id="app">
    <NavBar />
    <router-view />
    <BotonCarrito />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import BotonCarrito from './components/BotonCarrito.vue';

export default {
  components: {
    NavBar,
    BotonCarrito
  }
};
</script>
