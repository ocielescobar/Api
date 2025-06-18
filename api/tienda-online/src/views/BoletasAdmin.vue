<template>
  <div class="boletas-admin-container">
    <h2>Boletas Generadas</h2>

    <div v-if="cargando" class="cargando">Cargando boletas...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="boletas.length === 0" class="mensaje-vacio">No hay boletas generadas.</div>

    <table v-else class="tabla-boletas">
      <thead>
        <tr>
          <th>ID Boleta</th>
          <th>Monto Total</th>
          <th>Fecha</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="b in boletas" :key="b.id_pedido">
          <td>#{{ b.id_pedido }}</td>
          <td>
            CLP ${{ Number(b.total).toFixed(2) }} <br />
            <small v-if="valorDolar">USD ${{ convertirADolares(b.total) }}</small>
          </td>
          <td>{{ formatFecha(b.fecha) }}</td>
          <td>
            <router-link class="btn-detalle" :to="`/boleta/${b.id_pedido}`">Ver Detalle</router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <button class="btn-volver" @click="$router.push('/admin/productos')">Volver</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boletas: [],
      cargando: true,
      error: null,
      valorDolar: null
    };
  },
  mounted() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.rol !== "admin") {
      this.error = "Acceso denegado. No eres administrador.";
      this.cargando = false;
      setTimeout(() => this.$router.push("/productos"), 2000);
      return;
    }

    this.obtenerValorDolar();

    fetch("http://localhost:3000/api/boleta/debug/pedidos2")
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener boletas");
        return res.json();
      })
      .then(data => {
        this.boletas = Array.isArray(data) ? data : [];
        this.cargando = false;
      })
      .catch(err => {
        console.error("❌ Error al cargar boletas:", err);
        this.error = "No se pudieron cargar las boletas.";
        this.cargando = false;
      });
  },
  methods: {
    formatFecha(fecha) {
      if (!fecha) return "Sin fecha";
      return new Date(fecha).toLocaleDateString("es-CL", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
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
      if (!this.valorDolar) return "--";
      return (valorCLP / this.valorDolar).toFixed(2);
    }
  }
};
</script>

<style src="@/assets/css/boletasadmin.css"></style>
