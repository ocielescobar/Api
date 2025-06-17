<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="boleta-container">
    <h2>Boleta Generada</h2>

    <div v-if="cargando" class="mensaje-cargando">
      <p>Cargando datos de la boleta...</p>
    </div>

    <div v-else-if="error" class="mensaje-error">
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <table class="tabla-boleta">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in boleta" :key="item.nombre">
            <td>{{ item.nombre }}</td>
            <td>{{ item.cantidad }}</td>
            <td>${{ Number(item.precio_unitario).toFixed(2) }}</td>
            <td>${{ Number(item.total).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <h3 class="total-final">Total: ${{ calcularTotal().toFixed(2) }}</h3>

      <button class="btn-volver" @click="$router.push('/productos')">Volver a la tienda</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boleta: [],
      cargando: true,
      error: null
    }
  },
  mounted() {
    const idPedido = this.$route.params.id_pedido;

    fetch(`http://localhost:3000/api/boleta/${idPedido}`)
      .then(res => {
        if (!res.ok) throw new Error('No se encontró la boleta');
        return res.json();
      })
      .then(data => {
        this.boleta = data;
        this.cargando = false;

        let historial = JSON.parse(localStorage.getItem("boletasGuardadas")) || [];
        if (!historial.includes(idPedido)) {
          historial.push(idPedido);
          localStorage.setItem("boletasGuardadas", JSON.stringify(historial));
        }
      })
      .catch(err => {
        this.error = err.message;
        this.cargando = false;
      });
  },
  methods: {
    calcularTotal() {
      return this.boleta.reduce((sum, item) => {
        return sum + (item.precio_unitario * item.cantidad);
      }, 0);
    }
  }
}
</script>

<style src="@/assets/css/boleta.css"></style>
