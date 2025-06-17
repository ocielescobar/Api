<template>
  <div>
    <h1>Gestión de Productos</h1>

    <table border="1" cellpadding="8" style="width: 100%; text-align: left;">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Actualizar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in productos" :key="producto.id_producto">
          <td>{{ producto.nombre }}</td>
          <td>${{ producto.precio }}</td>
          <td>
            <input
              type="number"
              v-model.number="producto.nuevoStock"
              min="0"
              style="width: 80px;"
            />
          </td>
          <td>
            <button @click="actualizarStock(producto)">Guardar</button>
          </td>
          <td>
            <button @click="eliminarProducto(producto)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Botón para mostrar formulario nuevo producto -->
    <button @click="mostrarFormularioNuevo = true" style="margin-top: 20px;">Agregar nuevo producto</button>

    <!-- Formulario simplificado -->
    <div v-if="mostrarFormularioNuevo" style="margin-top: 20px; border: 1px solid gray; padding: 10px;">
      <h3>Nuevo Producto</h3>
      <input v-model="nuevoProducto.nombre" placeholder="Nombre" />
      <input v-model.number="nuevoProducto.precio" type="number" placeholder="Precio" />
      <input v-model.number="nuevoProducto.stock" type="number" placeholder="Stock" />

      <div style="margin-top: 10px;">
        <button @click="guardarNuevoProducto">Guardar</button>
        <button @click="mostrarFormularioNuevo = false">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productos: [],
      idUsuario: null,
      mostrarFormularioNuevo: false,
      nuevoProducto: {
        nombre: '',
        precio: null,
        stock: null
      }
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (!user || !user.id_usuario || user.rol !== "admin") {
      alert("Acceso denegado. Esta vista es solo para administradores.");
      this.$router.push("/login");
      return;
    }

    this.idUsuario = user.id_usuario;
    this.cargarProductos();
  },
  methods: {
    cargarProductos() {
      fetch("http://localhost:3000/api/productos")
        .then(res => res.json())
        .then(data => {
          this.productos = data.map(p => ({
            ...p,
            nuevoStock: p.stock
          }));
        })
        .catch(err => {
          console.error("Error al cargar productos:", err);
          alert("No se pudieron cargar los productos.");
        });
    },
    actualizarStock(producto) {
      const id = producto.id_producto;
      const stock = Number(producto.nuevoStock);

      if (!id || isNaN(stock)) {
        alert("Datos inválidos. Verifica el ID y stock.");
        return;
      }

      fetch("http://localhost:3000/api/productos/stock", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_producto: id,
          nuevo_stock: stock
        })
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || "Stock actualizado correctamente");
          producto.stock = stock;
        })
        .catch(err => {
          console.error("Error al actualizar stock:", err);
          alert("No se pudo actualizar el stock.");
        });
    },
    eliminarProducto(producto) {
      if (!confirm(`¿Seguro que deseas eliminar "${producto.nombre}"?`)) return;

      fetch(`http://localhost:3000/api/productos/${producto.id_producto}`, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || "Producto eliminado correctamente");
          this.productos = this.productos.filter(p => p.id_producto !== producto.id_producto);
        })
        .catch(err => {
          console.error("Error al eliminar producto:", err);
          alert("No se pudo eliminar el producto.");
        });
    },
    guardarNuevoProducto() {
  const p = this.nuevoProducto;

  if (!p.nombre || !p.precio || !p.stock) {
    alert("Completa los campos obligatorios: nombre, precio y stock.");
    return;
  }

  fetch("http://localhost:3000/api/productos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p)
  })
    .then(async res => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al agregar producto");
      }

      alert(data.message || "Producto agregado");
      this.productos.push({
        ...p,
        id_producto: data.productoId,
        nuevoStock: p.stock
      });
      this.mostrarFormularioNuevo = false;
      this.nuevoProducto = {
        nombre: '',
        precio: '',
        stock: ''
      };
    })
    .catch(err => {
      console.error("Error al agregar producto:", err);
      alert(err.message || "No se pudo agregar el producto.");
    });
}
  }
};
</script>
