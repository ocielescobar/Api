<template>
  <div class="register-container">
    <div class="register-form">
      <h2>Registro de Usuario</h2>
      <form @submit.prevent="register">
        <div>
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" v-model="nombre" required />
        </div>
        <div>
          <label for="correo">Correo electrónico:</label>
          <input type="email" id="correo" v-model="correo" required />
        </div>
        <div>
          <label for="contrasena">Contraseña:</label>
          <input type="password" id="contrasena" v-model="contrasena" required />
        </div>
        <div>
          <label for="rol">Rol:</label>
          <select id="rol" v-model="rol" required>
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit">Registrarse</button>
        <p v-if="mensaje" class="mensaje-ok">{{ mensaje }}</p>
        <p v-if="error" class="mensaje-error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterView",
  data() {
    return {
      nombre: "",
      correo: "",
      contrasena: "",
      rol: "cliente",
      error: null,
      mensaje: null
    };
  },
  methods: {
    async register() {
      this.error = null;
      this.mensaje = null;
      try {
        const response = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nombre: this.nombre,
            correo: this.correo,
            contrasena: this.contrasena,
            rol: this.rol
          })
        });

        const data = await response.json();

        if (response.ok) {
          alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
          this.$router.push("/login");
          this.nombre = "";
          this.correo = "";
          this.contrasena = "";
          this.rol = "cliente";
        } else {
          this.error = data.message || "Error en el registro";
        }
      } catch (err) {
        this.error = "No se pudo conectar al servidor";
        console.error(err);
      }
    }
  }
};
</script>

<style src="@/assets/css/register.css"></style>
