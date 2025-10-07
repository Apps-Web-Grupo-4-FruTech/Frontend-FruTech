<template>
  <div class="flex align-items-center justify-content-center h-screen p-4">
    <div class="flex lg:flex-row flex-column shadow-2 border-round overflow-hidden" style="max-width: 900px; width: 100%;">
      <div class="lg:w-6 w-full p-4 flex align-items-center justify-content-center" style="background-color: var(--surface-section)">
        <Card class="w-full max-w-30rem shadow-none border-none">
          <template #title>
            <div class="text-center">
              <img src="../../../../assets/logo.svg" alt="CultivApp Logo" class="h-4rem mb-3">
              <h2>Iniciar Sesión</h2>
            </div>
          </template>
          <template #content>
            <div class="flex flex-column gap-3">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                  <i class="pi pi-envelope"></i>
                </span>
                <InputText placeholder="Correo Electrónico" />
              </div>
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                  <i class="pi pi-lock"></i>
                </span>
                <Password placeholder="Contraseña" :feedback="false" />
              </div>
              <Button label="Ingresar" @click="login" />
            </div>
          </template>
        </Card>
      </div>

      <div class="lg:w-6 w-full p-4 flex align-items-center justify-content-center" style="background-color: var(--p-primary-500); color: var(--p-primary-color-text)">
        <div class="text-center">
          <h2 class="font-bold text-3xl mb-3">Bienvenido de Nuevo</h2>
          <p>Gestiona tus cultivos de forma inteligente.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// El script no necesita cambios
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

const router = useRouter();
const login = () => {
  router.push('/dashboard');
};
</script>