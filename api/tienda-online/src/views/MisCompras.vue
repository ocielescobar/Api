<template>
  <div class="mis-compras-container">
    <h2>Mis Compras</h2>

    <div v-if="cargando" class="cargando">Cargando pedidos...</div>
    <div v-else-if="pedidos.length === 0" class="sin-compras">No tienes compras registradas.</div>

    <table v-else class="tabla-compras">
      <thead>
        <tr>
          <th>ID Pedido</th>
          <th>Fecha</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in pedidos" :key="p.id_pedido">
          <td>{{ p.id_pedido }}</td>
          <td>{{ formatearFecha(p.fecha_pedido) }}</td>
          <td>
            ${{ Number(p.total).toFixed(0) }} CLP<br />
            <small v-if="valorDolar">USD ${{ convertirADolares(p.total) }}</small>
          </td>
          <td>
            <span :class="estadoClase(p.estado_pedido)">
              {{ estadoTexto(p.estado_pedido) }}
            </span>
          </td>
          <td>
            <button class="ver-btn" @click="verBoleta(p.id_pedido, p.estado_pedido)">
              {{ p.estado_pedido === 2 ? 'Ver Boleta' : 'Ver Pedido' }}
            </button>
            <button
              v-if="p.estado_pedido === 1"
              class="cancelar-btn"
              @click="cancelarPedido(p.id_pedido)"
            >
              Cancelar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pedidos: [],
      cargando: true,
      idUsuario: null,
      valorDolar: null
    };
  },
  methods: {
    cargarPedidos() {
      fetch(`http://localhost:3000/api/boleta/usuario/${this.idUsuario}`)
        .then(res => res.json())
        .then(data => {
          this.pedidos = data;
          this.cargando = false;
        });
    },
    obtenerDolar() {
      fetch("http://localhost:3000/api/banco/dolar")
        .then(res => res.json())
        .then(data => {
          this.valorDolar = data.dolar;
        })
        .catch(err => {
          console.error("Error al obtener el valor del dólar:", err);
        });
    },
    convertirADolares(montoCLP) {
      return this.valorDolar ? (montoCLP / this.valorDolar).toFixed(2) : '--';
    },
    verBoleta(id, estado) {
      if (estado === 2) {
        this.$router.push(`/boleta/${id}`);
      } else {
        this.$router.push(`/pedido/${id}`);
      }
    },
    cancelarPedido(id) {
      if (!confirm('¿Seguro que quieres cancelar este pedido?')) return;
      fetch(`http://localhost:3000/api/boleta/cancelar/${id}`, { method: 'POST' })
        .then(res => res.json())
        .then(() => this.cargarPedidos());
    },
    estadoTexto(estado) {
      return estado === 1 ? 'Pendiente' : estado === 2 ? 'Pagado' : 'Otro';
    },
    estadoClase(estado) {
      return estado === 1 ? 'estado-pendiente' : estado === 2 ? 'estado-pagado' : 'estado-otro';
    },
    formatearFecha(fecha) {
      const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return new Date(fecha).toLocaleString('es-CL', opciones);
    }
  },
  mounted() {
    try {
      const rawUser = localStorage.getItem('usuario');
      if (!rawUser) {
        this.cargando = false;
        return;
      }

      const usuario = JSON.parse(rawUser);
      if (!usuario || !usuario.id_usuario) {
        this.cargando = false;
        return;
      }

      this.idUsuario = usuario.id_usuario;
      this.obtenerDolar(); // 💲 Obtiene el valor del dólar
      this.cargarPedidos();
    } catch (error) {
      console.error("Error al obtener datos de usuario:", error);
      this.cargando = false;
    }
  }
};
</script>

<style src="@/assets/css/miscompras.css"></style>
