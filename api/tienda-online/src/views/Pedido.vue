<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="pedido-container">
    <h2>Pedido Generado</h2>

    <div v-if="cargando" class="mensaje-cargando">
      <p>Cargando boleta...</p>
    </div>

    <div v-else-if="error" class="mensaje-error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="boleta.length === 0" class="mensaje-vacio">
      <p>No se encontraron detalles de la boleta.</p>
    </div>

    <div v-else>
      <table class="tabla-pedido">
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
            <td class="producto-cell">
              <div class="imagen-nombre">
                <img
                  v-if="item.imagen"
                  :src="'http://localhost:3000' + item.imagen"
                  alt="producto"
                  class="imagen-pedido"
                />
                <span>{{ item.nombre }}</span>
              </div>
            </td>
            <td>{{ item.cantidad }}</td>
            <td>${{ Number(item.precio_unitario).toFixed(2) }}</td>
            <td>${{ Number(item.total).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <h3 class="total-final">Total: ${{ calcularTotal().toFixed(2) }}</h3>

      <div class="acciones-pedido">
        <button class="btn-cancelar" @click="cancelarPedido">Cancelar Pedido</button>
        <button class="btn-pagar" @click="pagarPedido">Pagar con Webpay</button>
      </div>
    </div>

    <button class="btn-volver" @click="$router.push('/productos')">Volver a la tienda</button>
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

<style src="@/assets/css/pedido.css"></style>
