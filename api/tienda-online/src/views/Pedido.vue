<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h2>Pedido Generado</h2>

    <div v-if="cargando">
      <p>Cargando boleta...</p>
    </div>

    <div v-else-if="error">
      <p style="color: red;">{{ error }}</p>
    </div>

    <div v-else-if="boleta.length === 0">
      <p>No se encontraron detalles de la boleta.</p>
    </div>

    <div v-else>
      <table border="1" cellpadding="8" style="margin-top: 10px;">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in boleta" :key="item.nombre">
            <td>{{ item.nombre }}</td>
            <td>{{ item.cantidad }}</td>
            <td>${{ Number(item.precio_unitario).toFixed(2) }}</td>
            <td>${{ Number(item.total).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <h3 style="margin-top: 20px;">Total: ${{ calcularTotal().toFixed(2) }}</h3>

      <div style="margin-top: 30px;">
        <button @click="cancelarPedido" style="margin-right: 10px; background-color: red; color: white;">
          Cancelar Pedido
        </button>

        <button @click="pagarPedido" style="background-color: green; color: white;">
          Pagar con Webpay
        </button>
      </div>
    </div>

    <button @click="$router.push('/productos')" style="margin-top: 20px;">Volver a la tienda</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boleta: [],
      cargando: true,
      idPedido: null,
      error: null,
      idUsuario: null
    };
  },
  mounted() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    this.idUsuario = usuario?.id_usuario;

    if (!this.idUsuario) {
      alert("Debes iniciar sesión");
      this.$router.push("/login");
      return;
    }

    this.idPedido = this.$route.params.id_pedido;

    if (!this.idPedido) {
      this.error = "ID de pedido inválido";
      this.cargando = false;
      return;
    }

    fetch(`http://localhost:3000/api/boleta/${this.idPedido}`)
      .then((res) => {
        if (!res.ok) throw new Error("Boleta no encontrada");
        return res.json();
      })
      .then((data) => {
        this.boleta = data;
        this.cargando = false;
      })
      .catch((err) => {
        console.error("Error al cargar boleta:", err);
        this.error = err.message || "Error inesperado";
        this.cargando = false;
      });
  },
  methods: {
    calcularTotal() {
      return this.boleta.reduce((sum, item) => {
        return sum + (Number(item.precio_unitario) * Number(item.cantidad));
      }, 0);
    },
    cancelarPedido() {
      if (!confirm('¿Estás seguro de que deseas cancelar el pedido?')) return;

      fetch(`http://localhost:3000/api/boleta/cancelar/${this.idPedido}`, {
        method: 'POST',
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || 'Pedido cancelado');
          this.$router.push('/productos');
        })
        .catch(err => {
          console.error('Error al cancelar el pedido:', err);
          alert('No se pudo cancelar el pedido.');
        });
    },
    pagarPedido() {
      const monto = this.calcularTotal();
      fetch("http://localhost:3000/webpay/iniciar-transaccion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_pedido: this.idPedido,
          monto: monto
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.url && data.token) {
            window.location.href = `${data.url}?token_ws=${data.token}`;
          } else {
            throw new Error("No se pudo iniciar el pago");
          }
        })
        .catch(err => {
          console.error("Error al iniciar Webpay:", err);
          alert("Error al iniciar pago Webpay");
        });
    }
  }
};
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th {
  background-color: #f2f2f2;
}
td, th {
  text-align: center;
}
button {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
</style>
