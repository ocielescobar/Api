<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h1>Catálogo de Productos</h1>
    <div
      v-for="producto in productos"
      :key="producto.id_producto"
      style="border: 1px solid gray; padding: 10px; margin: 10px;"
    >
      <p><strong>{{ producto.nombre }}</strong> - ${{ producto.precio }}</p>
      <p>Stock disponible: {{ producto.stock }}</p>
      <button
        @click="agregarAlCarrito(producto.id_producto)"
        :disabled="producto.stock <= 0"
      >
        Agregar al carrito
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productos: [],
      idUsuario: null
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (!user || !user.id_usuario) {
      alert("No has iniciado sesión. Redirigiendo al login...");
      this.$router.push("/login");
      return;
    }

    this.idUsuario = user.id_usuario;

    fetch("http://localhost:3000/api/productos")
      .then(response => response.json())
      .then(data => this.productos = data)
      .catch(err => {
        console.error("Fallo al obtener productos:", err);
        alert("No se pudo cargar el catálogo");
      });
  },
  methods: {
    agregarAlCarrito(idProducto) {
      fetch("http://localhost:3000/api/carrito/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: this.idUsuario,
          id_producto: idProducto,
          cantidad: 1
        })
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || "Producto agregado");
          const producto = this.productos.find(p => p.id_producto === idProducto);
          if (producto && producto.stock > 0) {
            producto.stock -= 1;
          }
        })
        .catch(err => {
          console.error(err);
          alert("Error al agregar al carrito");
        });
    }
  }
};
</script>
