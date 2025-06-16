<template>
  <nav>
    <!-- Menú para usuarios no logueados -->
    <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
    <router-link v-if="!isLoggedIn" to="/registro">Registrarse</router-link>

    <!-- Menú para usuarios logueados -->
    <template v-else>
      <!-- CLIENTES -->
      <template v-if="!isAdmin">
        <router-link to="/productos">Productos</router-link> |
        <router-link to="/carrito">Carrito</router-link> |
        <router-link to="/mis-compras">Mis Compras</router-link> |
      </template>

      <!-- ADMINISTRADORES -->
      <template v-if="isAdmin">
        <router-link to="/productos">Stock de Productos</router-link>
        <router-link to="/admin/boletas">Boletas</router-link> |
      </template>

      <!-- Botón común -->
      <a href="#" @click.prevent="logout">Cerrar sesión</a>
    </template>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false,
      boletas: [],
      mostrarDropdown: false
    }
  },
  mounted() {
    this.checkAuth()
    this.cargarBoletas()
  },
  watch: {
    $route() {
      this.checkAuth()
      this.cargarBoletas()
    }
  },
  methods: {
    checkAuth() {
      const rawUser = localStorage.getItem('usuario');
      if (!rawUser) {
        this.isLoggedIn = false;
        this.isAdmin = false;
        return;
      }

      try {
        const user = JSON.parse(rawUser);
        this.isLoggedIn = !!user.id_usuario;
        this.isAdmin = user.rol === 'admin';
      } catch (error) {
        console.warn("Usuario malformado:", error);
        this.isLoggedIn = false;
        this.isAdmin = false;
      }
    },
    logout() {
      localStorage.clear();
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.boletas = [];
      this.$router.push('/login');
    },
    cargarBoletas() {
      const almacenadas = JSON.parse(localStorage.getItem("boletasGuardadas")) || [];
      this.boletas = almacenadas;
    },
    verBoleta(id) {
      this.$router.push(`/boleta/${id}`);
      this.mostrarDropdown = false;
    },
    eliminarBoleta(id) {
      if (!confirm(`¿Eliminar la boleta #${id} del historial local?`)) return;
      let almacenadas = JSON.parse(localStorage.getItem("boletasGuardadas")) || [];
      almacenadas = almacenadas.filter(b => b !== id);
      localStorage.setItem("boletasGuardadas", JSON.stringify(almacenadas));
      this.cargarBoletas();
    },
    eliminarTodas() {
      if (!confirm("¿Seguro que quieres eliminar TODAS las boletas del historial local?")) return;
      localStorage.removeItem("boletasGuardadas");
      localStorage.removeItem("ultimoPedido");
      this.cargarBoletas();
      this.mostrarDropdown = false;
    },
    toggleDropdown() {
      this.mostrarDropdown = !this.mostrarDropdown;
    }
  }
}
</script>

<style scoped>
nav {
  padding: 10px;
  background-color: #eee;
  margin-bottom: 20px;
}
router-link, a, button {
  margin: 0 10px;
  text-decoration: none;
  color: #333;
}
.dropdown {
  display: inline-block;
  position: relative;
}
.dropdown-content {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  z-index: 1;
}
.boleta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.boleta-item button {
  margin-left: 10px;
  background: none;
  border: none;
  color: red;
  cursor: pointer;
}
.dropdown-content button {
  background-color: #f44336;
  color: white;
  padding: 5px;
  border: none;
  width: 100%;
  cursor: pointer;
}
.dropdown-content button:hover {
  background-color: #d32f2f;
}
</style>
