<template>
  <div>
    <h2>Boletas Generadas (Pagadas con Webpay)</h2>

    <div v-if="cargando">Cargando boletas...</div>
    <div v-else-if="error" style="color: red;">{{ error }}</div>
    <div v-else-if="boletas.length === 0">No hay boletas registradas.</div>

    <table v-else border="1" cellpadding="8" style="margin-top: 20px; width: 100%;">
      <thead>
        <tr>
          <th>ID Pedido</th>
          <th>Monto</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Ver</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="b in boletas" :key="b.id_transaccion">
          <td>{{ b.id_pedido }}</td>
          <td>${{ Number(b.monto).toFixed(2) }}</td>
          <td>{{ b.status }}</td>
          <td>{{ formatFecha(b.fecha_transaccion) }}</td>
          <td><router-link :to="`/boleta/${b.id_pedido}`">Ver Boleta</router-link></td>
        </tr>
      </tbody>
    </table>

    <button @click="$router.push('/productos')" style="margin-top: 20px;">Volver</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boletas: [],
      cargando: true,
      error: null
    };
  },
  mounted() {
    fetch('http://localhost:3000/webpay/historial')
      .then(res => {
        if (!res.ok) throw new Error("No se pudo obtener el historial");
        return res.json();
      })
      .then(data => {
        this.boletas = data;
        this.cargando = false;
      })
      .catch(err => {
        console.error("Error al obtener boletas:", err);
        this.error = err.message || "Error inesperado";
        this.cargando = false;
      });
  },
  methods: {
    formatFecha(fecha) {
      const date = new Date(fecha);
      return date.toLocaleString();
    }
  }
};
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
}
th {
  background-color: #f0f0f0;
}
td, th {
  text-align: center;
}
</style>
