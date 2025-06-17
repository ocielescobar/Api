<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="catalogo-container">
    <h1>Catálogo de Productos</h1>

    <div
      class="producto-card"
      v-for="producto in productos"
      :key="producto.id_producto"
    >
      <p class="nombre"><strong>{{ producto.nombre }}</strong></p>
      <p class="precio">$ {{ producto.precio }}</p>
      <p class="stock">Stock disponible: {{ producto.stock }}</p>

      <div class="acciones">
        <input
          type="number"
          v-model.number="producto.cantidadDeseada"
          :max="producto.stock"
          min="1"
          :disabled="producto.stock <= 0"
        />
        <button
          @click="agregarAlCarrito(producto)"
          :disabled="producto.stock <= 0 || (producto.cantidadDeseada || 1) > producto.stock"
        >
          Agregar al carrito
        </button>
      </div>
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
    this.cargarProductos();
  },
  methods: {
    cargarProductos() {
      fetch("http://localhost:3000/api/productos")
        .then(response => response.json())
        .then(data => {
          this.productos = data.map(p => ({
            ...p,
            cantidadDeseada: 1
          }));
        })
        .catch(err => {
          console.error("Fallo al obtener productos:", err);
          alert("No se pudo cargar el catálogo");
        });
    },
    agregarAlCarrito(producto) {
      const cantidad = producto.cantidadDeseada || 1;

      fetch("http://localhost:3000/api/carrito/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: this.idUsuario,
          id_producto: producto.id_producto,
          cantidad: cantidad
        })
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || "Producto agregado");
          if (producto.stock >= cantidad) {
            producto.stock -= cantidad;
          }
        })
        .catch(err => {
          console.error(err);
          alert("Error al agregar al carrito");
        });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.cargarProductos();
    });
  }
};
</script>

<style src="@/assets/css/producto.css"></style>
