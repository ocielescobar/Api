<template>
  <button v-if="mostrar" class="boton-carrito" @click="irAlCarrito">
    <img src="@/assets/img/LogoBoton.png" alt="Carrito" class="icono-carrito" />
    <span class="contador" v-if="totalProductos > 0">{{ totalProductos }}</span>
  </button>
</template>

<script>
export default {
  data() {
    return {
      totalProductos: 0,
      mostrar: false
    };
  },
  mounted() {
    this.verificarCarrito();
  },
  watch: {
    $route() {
      this.verificarCarrito();
    }
  },
  methods: {
    verificarCarrito() {
      const rawUser = localStorage.getItem("usuario");
      if (!rawUser) {
        this.mostrar = false;
        return;
      }

      const user = JSON.parse(rawUser);
      if (user.rol === "admin" || this.$route.path === "/carrito") {
        this.mostrar = false;
        return;
      }

      fetch(`http://localhost:3000/api/carrito/${user.id_usuario}`)
        .then(res => res.json())
        .then(data => {
          this.totalProductos = data.reduce((sum, item) => sum + item.cantidad, 0);
          this.mostrar = this.totalProductos > 0;
        })
        .catch(err => {
          console.error("Error al verificar carrito:", err);
          this.mostrar = false;
        });
    },
    irAlCarrito() {
      this.$router.push("/carrito");
    }
  }
};
</script>

<style scoped>
.boton-carrito {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  padding: 0;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icono-carrito {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 50%;
}

.contador {
  position: absolute;
  top: 2px;
  right: 2px;
  background: red;
  color: white;
  font-size: 12px;
  font-weight: bold;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
}
</style>
