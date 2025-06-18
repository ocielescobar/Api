<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="boleta-container">
    <h2>Boleta Generada</h2>

    <div v-if="cargando" class="mensaje-cargando">
      <p>Cargando datos de la boleta...</p>
    </div>

    <div v-else-if="error" class="mensaje-error">
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <table class="tabla-boleta">
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
            <td>
              CLP ${{ Number(item.precio_unitario).toFixed(2) }}<br />
              <small v-if="valorDolar">USD ${{ convertirADolares(item.precio_unitario) }}</small>
            </td>
            <td>
              CLP ${{ Number(item.total).toFixed(2) }}<br />
              <small v-if="valorDolar">USD ${{ convertirADolares(item.total) }}</small>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 class="total-final">
        Total: CLP ${{ calcularTotal().toFixed(2) }}
        <br v-if="valorDolar" />
        <small v-if="valorDolar">USD ${{ convertirADolares(calcularTotal()) }}</small>
      </h3>

      <div class="botones-navegacion">
        <button class="btn-volver" @click="volverCompras()">
          {{ rol === 'admin' ? 'Volver a Boletas' : 'Volver a Mis Compras' }}
        </button>
        <button class="btn-volver" @click="volverTienda()">
          {{ rol === 'admin' ? 'Volver a Stock' : 'Volver a la tienda' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boleta: [],
      cargando: true,
      error: null,
      valorDolar: null,
      rol: null
    };
  },
  mounted() {
    const idPedido = this.$route.params.id_pedido;

    fetch(`http://localhost:3000/api/boleta/${idPedido}`)
      .then(res => {
        if (!res.ok) throw new Error('No se encontró la boleta');
        return res.json();
      })
      .then(data => {
        this.boleta = data;
        this.cargando = false;

        let historial = JSON.parse(localStorage.getItem("boletasGuardadas")) || [];
        if (!historial.includes(idPedido)) {
          historial.push(idPedido);
          localStorage.setItem("boletasGuardadas", JSON.stringify(historial));
        }
      })
      .catch(err => {
        this.error = err.message;
        this.cargando = false;
      });

    this.obtenerValorDolar();

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    this.rol = usuario?.rol || "cliente";
  },
  methods: {
    calcularTotal() {
      return this.boleta.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0);
    },
    obtenerValorDolar() {
      fetch("http://localhost:3000/api/banco/dolar")
        .then(res => res.json())
        .then(data => {
          this.valorDolar = data.dolar;
        })
        .catch(err => {
          console.error("Error al obtener el valor del dólar:", err);
        });
    },
    convertirADolares(valorCLP) {
      return this.valorDolar ? (valorCLP / this.valorDolar).toFixed(2) : '--';
    },
    volverCompras() {
      this.$router.push(this.rol === 'admin' ? '/admin/boletas' : '/mis-compras');
    },
    volverTienda() {
      this.$router.push(this.rol === 'admin' ? '/admin/productos' : '/productos');
    }
  }
};
</script>

<style src="@/assets/css/boleta.css"></style>
