<template>
  <div class="admin-container">
    <h1>Gestión de Productos</h1>

    <table class="tabla-productos">
      <thead>
        <tr>
          <th></th>
          <th>Nombre</th>
          <th>Precio (CLP / USD)</th>
          <th>Stock</th>
          <th>Actualizar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in productos" :key="producto.id_producto">
          <td>
            <img
              :src="producto.imagen ? 'http://localhost:3000' + producto.imagen : require('@/assets/img/placeholder.png')"
              alt="Imagen producto"
              class="imagen-miniatura"
            />
          </td>
          <td>{{ producto.nombre }}</td>
          <td>
            CLP ${{ producto.precio }}<br />
            <small v-if="valorDolar">USD ${{ convertirADolares(producto.precio) }}</small>
          </td>
          <td>
            <input
              type="number"
              v-model.number="producto.nuevoStock"
              min="0"
              class="stock-input"
            />
          </td>
          <td>
            <button @click="actualizarStock(producto)" class="btn-guardar">Guardar</button>
          </td>
          <td>
            <button @click="eliminarProducto(producto)" class="btn-eliminar">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button @click="mostrarFormularioNuevo = true" class="btn-agregar">Agregar nuevo producto</button>

    <div v-if="mostrarFormularioNuevo" class="formulario-nuevo">
      <h3>Nuevo Producto</h3>
      <input v-model="nuevoProducto.nombre" placeholder="Nombre" />
      <input v-model.number="nuevoProducto.precio" type="number" placeholder="Precio CLP" />
      <input v-model.number="nuevoProducto.stock" type="number" placeholder="Stock" />
      <input type="file" @change="onImagenSeleccionada" accept="image/*" />

      <div class="form-botones">
        <button @click="guardarNuevoProducto" class="btn-guardar">Guardar</button>
        <button @click="mostrarFormularioNuevo = false" class="btn-cancelar">Cancelar</button>
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
      valorDolar: null,
      mostrarFormularioNuevo: false,
      nuevoProducto: {
        nombre: '',
        precio: null,
        stock: null
      },
      imagenSeleccionada: null
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
    this.obtenerDolar();
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
    obtenerDolar() {
      fetch("http://localhost:3000/api/banco/dolar")
        .then(res => res.json())
        .then(data => {
          this.valorDolar = data.dolar;
        })
        .catch(err => {
          console.error("Error al obtener valor del dólar:", err);
        });
    },
    convertirADolares(precioCLP) {
      return this.valorDolar ? (precioCLP / this.valorDolar).toFixed(2) : '--';
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
        .then(async res => {
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Error al eliminar el producto");
          }

          alert(data.message || "Producto eliminado correctamente");
          this.productos = this.productos.filter(p => p.id_producto !== producto.id_producto);
        })
        .catch(err => {
          console.error("Error al eliminar el producto:", err);
          alert(err.message || "No se pudo eliminar el producto.");
        });
    },
    onImagenSeleccionada(event) {
      this.imagenSeleccionada = event.target.files[0];
    },
    guardarNuevoProducto() {
      const p = this.nuevoProducto;
      if (!p.nombre || !p.precio || !p.stock) {
        alert("Completa los campos obligatorios: nombre, precio y stock.");
        return;
      }

      const formData = new FormData();
      formData.append("nombre", p.nombre);
      formData.append("precio", p.precio);
      formData.append("stock", p.stock);
      if (this.imagenSeleccionada) {
        formData.append("imagen", this.imagenSeleccionada);
      }

      fetch("http://localhost:3000/api/productos", {
        method: "POST",
        body: formData
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
          this.imagenSeleccionada = null;
        })
        .catch(err => {
          console.error("Error al agregar producto:", err);
          alert(err.message || "No se pudo agregar el producto.");
        });
    }
  }
};
</script>

<style src="@/assets/css/adminproductos.css"></style>
