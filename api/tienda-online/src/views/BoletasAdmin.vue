<template>
  <div>
    <h2>Boletas Generadas</h2>

    <div v-if="cargando">Cargando boletas...</div>
    <div v-else-if="error" style="color: red;">{{ error }}</div>
    <div v-else-if="boletas.length === 0">No hay boletas generadas.</div>

    <table v-else border="1" cellpadding="8" style="margin-top: 20px; width: 100%;">
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
          <td>${{ Number(b.total).toFixed(2) }}</td>
          <td>{{ formatFecha(b.fecha) }}</td>
          <td>
            <router-link :to="`/boleta/${b.id_pedido}`">Ver Detalle</router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <button @click="$router.push('/productos')" style="margin-top: 20px;">Volver</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boletas: [],
      cargando: true,
      error: null
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

    console.log("🛂 Usuario administrador:", usuario);

    fetch("http://localhost:3000/api/boleta/debug/pedidos2")
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener boletas");
        return res.json();
      })
      .then(data => {
        console.log("✅ Boletas pagadas:", data);
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
      return new Date(fecha).toLocaleDateString("es-CL");
    }
  }
};
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
}
th {
  background-color: #f2f2f2;
}
td, th {
  text-align: center;
}
</style>
