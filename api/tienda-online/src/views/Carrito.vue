<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="carrito-container">
    <h2>Carrito de Compras</h2>

    <div v-if="carrito.length === 0" class="mensaje-vacio">
      No hay productos en el carrito.
    </div>

    <div v-else>
      <div
        class="item-carrito"
        v-for="item in carrito"
        :key="item.id_producto"
      >
        <p class="detalle">
          <strong>{{ item.nombre }}</strong> - ${{ item.precio }} x {{ item.cantidad }} = <strong>${{ item.precio * item.cantidad }}</strong>
        </p>

        <div class="acciones">
          <button @click="cambiarCantidad(item.id_producto, item.cantidad - 1)" :disabled="item.cantidad <= 1">-</button>
          <span class="cantidad">{{ item.cantidad }}</span>
          <button @click="cambiarCantidad(item.id_producto, item.cantidad + 1)">+</button>
          <button class="eliminar" @click="eliminarProducto(item.id_producto)">Eliminar</button>
        </div>
      </div>

      <div class="confirmar-compra">
        <button @click="confirmarCompra">Confirmar compra</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      carrito: [],
      idUsuario: null
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (!user || !user.id_usuario) {
      alert("Debes iniciar sesión");
      this.$router.push("/login");
      return;
    }

    this.idUsuario = user.id_usuario;
    this.cargarCarrito();
  },
  methods: {
    cargarCarrito() {
      fetch(`http://localhost:3000/api/carrito/${this.idUsuario}`)
        .then(res => res.json())
        .then(data => this.carrito = data)
        .catch(err => {
          console.error("Error al cargar el carrito:", err);
          alert("No se pudo cargar el carrito");
        });
    },
    cambiarCantidad(idProducto, nuevaCantidad) {
      if (nuevaCantidad < 1) return;

      fetch("http://localhost:3000/api/carrito/actualizar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: this.idUsuario,
          id_producto: idProducto,
          cantidad: nuevaCantidad
        })
      })
        .then(res => res.json())
        .then(() => this.cargarCarrito())
        .catch(err => {
          console.error("Error al actualizar cantidad:", err);
          alert("Error al actualizar");
        });
    },
    eliminarProducto(idProducto) {
      if (!confirm("¿Eliminar este producto del carrito?")) return;

      fetch(`http://localhost:3000/api/carrito/eliminar/${this.idUsuario}/${idProducto}`, {
        method: "DELETE"
      })
        .then(() => this.cargarCarrito())
        .catch(err => {
          alert("Error al eliminar producto: " + err.message);
        });
    },
    confirmarCompra() {
      fetch("http://localhost:3000/api/boleta/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario: this.idUsuario })
      })
        .then(res => res.json())
        .then(data => {
          const idPedido = data.id_pedido;
          localStorage.setItem("ultimoPedido", idPedido);
          this.$router.push(`/pedido/${idPedido}`);
        })
        .catch(err => {
          console.error("Error al confirmar compra:", err);
          alert("Error: " + err.message);
        });
    }
  }
};
</script>

<style src="@/assets/css/carrito.css"></style>
