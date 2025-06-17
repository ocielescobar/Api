<style src="@/assets/css/login.css"></style>
<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="login">
      <div>
        <label for="username">Correo:</label>
        <input type="email" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Entrar</button>
      <p v-if="error" style="color: red">{{ error }}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
      error: null
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Guardar usuario en localStorage
          localStorage.setItem("usuario", JSON.stringify({
            id_usuario: data.id_usuario,
            rol: data.rol
          }));

          console.log("Inicio sesión como:", data);

          // ✅ Redirigir según el rol
          if (data.rol === "admin" || data.rol === "administrador") {
            this.$router.push("/admin/productos"); // vista exclusiva del administrador
          } else {
            this.$router.push("/productos"); // vista para clientes
          }
        } else {
          this.error = data.message || "Error al iniciar sesión";
        }
      } catch (err) {
        this.error = "No se pudo conectar al servidor";
        console.error(err);
      }
    }
  }
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
}
.login form div {
  margin-bottom: 15px;
}
</style>
