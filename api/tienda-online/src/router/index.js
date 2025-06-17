import Login from '../views/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Productos from '../views/Productos.vue'
import Registro from '../views/Registro.vue'
import Carrito from '../views/Carrito.vue'
import AdminPedidos from '../views/AdminPedidos.vue'
import Pedido from '@/views/Pedido.vue'
import HistorialTransacciones from '../views/HistorialTransacciones.vue';
import Transacciones from '@/views/Transacciones.vue';
import Boleta from '@/views/Boleta.vue'
import BoletasAdmin from '../views/BoletasAdmin.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/productos', component: Productos },
  { path: '/registro', component: Registro },
  { path: '/carrito', component: Carrito },
  { path: '/pedido/:id_pedido', component: Pedido }, // ← mantiene Pedido
  { path: '/boleta/:id_pedido', component: Boleta }, // ← boleta real post-pago
  { path: '/admin/pedidos', component: AdminPedidos },
  { path: '/admin/historial', component: HistorialTransacciones, meta: { requiresAdmin: true } },
  { path: '/transacciones', name: 'Transacciones', component: Transacciones },
  { path: '/mis-compras', name: 'MisCompras', component: () => import('@/views/MisCompras.vue') },
  { path: '/admin/boletas', component: BoletasAdmin, meta: { requiresAdmin: true } },
  { path: '/admin', redirect: '/admin/boletas' },
  { path: '/admin/productos', component: () => import('@/views/AdminProductos.vue'), meta: { requiresAuth: true, requiresAdmin: true }},
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const rawUser = localStorage.getItem('usuario');

  if (!rawUser && to.path !== '/login' && to.path !== '/registro') {
    console.warn("No has iniciado sesión. Redirigiendo al login...");
    return next('/login');
  }

  try {
    const user = JSON.parse(rawUser);

    // Si la ruta requiere admin y no lo es, lo mandamos a productos
    if (to.meta.requiresAdmin && user.rol !== 'admin') {
      return next('/productos');
    }
  } catch (e) {
    console.warn("Error leyendo el usuario:", e);
    return next('/login');
  }

  next();
});
export default router
