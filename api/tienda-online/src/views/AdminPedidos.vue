<template>
  <div>
    <h1>Admin - Pedidos</h1>
    <div v-for="pedido in pedidos" :key="pedido.idCompra" style="border: 1px solid gray; padding: 10px; margin: 10px;">
      <p>ID Compra: {{ pedido.idCompra }}</p>
      <p>Usuario: {{ pedido.idUsuario }}</p>
      <p>Estado: {{ pedido.estadoPedido }}</p>
      <p>Monto: ${{ pedido.monto }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pedidos: []
    }
  },
  mounted() {
    fetch('http://localhost:3000/api/compra')  // ajusta a tu endpoint correcto
      .then(response => response.json())
      .then(data => {
        this.pedidos = data
      })
  }
}
</script>
