<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h2>Historial de Transacciones Webpay</h2>
    <table border="1" cellpadding="8">
      <thead>
        <tr>
          <th>ID Pedido</th>
          <th>Usuario</th>
          <th>Monto</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in transacciones" :key="tx.id">
          <td>{{ tx.id_pedido }}</td>
          <td>{{ tx.usuario }}</td>
          <td>${{ tx.monto }}</td>
          <td>{{ new Date(tx.fecha_transaccion).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transacciones: []
    }
  },
  mounted() {
    fetch("http://localhost:3000/webpay/historial")
      .then(res => res.json())
      .then(data => this.transacciones = data)
      .catch(err => {
        console.error("Error al cargar historial:", err);
        alert("No se pudo cargar el historial");
      });
  }
}
</script>
