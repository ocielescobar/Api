<template>
  <div>
    <h2>Mis Compras</h2>
    <div v-if="cargando">Cargando pedidos...</div>
    <div v-else-if="pedidos.length === 0">No tienes compras registradas.</div>
    <table v-else border="1" cellpadding="10">
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
          <td>{{ new Date(p.fecha_pedido).toLocaleString() }}</td>
          <td>${{ Number(p.total).toFixed(0) }}</td>
          <td>
            <span v-if="p.estado_pedido === 1">Pendiente</span>
            <span v-else-if="p.estado_pedido === 2">Pagado</span>
            <span v-else>Otro</span>
          </td>
          <td>
            <button @click="verBoleta(p.id_pedido, p.estado_pedido)">
              {{ p.estado_pedido === 2 ? 'Ver Boleta' : 'Ver Pedido' }}
            </button>
            <button v-if="p.estado_pedido === 1" @click="cancelarPedido(p.id_pedido)">Cancelar</button>
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
      idUsuario: null
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
    }
  },
  mounted() {
  try {
    const rawUser = localStorage.getItem('usuario');
    console.log("Raw localStorage:", rawUser); // Debug

    if (!rawUser) {
      console.warn("No hay localStorage 'usuario'");
      this.cargando = false;
      return;
    }

    const usuario = JSON.parse(rawUser);
    console.log("Usuario parseado:", usuario); // Debug

    if (!usuario || !usuario.id_usuario) {
  console.warn("No hay sesión activa. Mostrando vista vacía.");
  this.cargando = false;
  return;
}

    this.idUsuario = usuario.id_usuario;
    this.cargarPedidos();

  } catch (error) {
    console.error("Error al obtener datos de usuario:", error);
    this.cargando = false;
  }
}
};
</script>
