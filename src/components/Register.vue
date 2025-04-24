<template>
      <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
<Form
    ref="registerForm"
     :validation-schema="validationSchema"
    @submit="onSubmit"
    class="flex flex-col gap-2"
  >
    <label for="email">Email</label>
    <Field
      id="email"
      type="text"
      name="email"
      class="p-2 border-2 rounded-sm border-gray-300"
    />
    <ErrorMessage name="email" class="text-red-700" />
    <label for="password">Password</label>
    <Field
      id="password"
      type="password"
      name="password"
      class="p-2 border-2 rounded-sm border-gray-300"
    />
    <ErrorMessage name="password" class="text-red-700" />
    <div class="flex justify-center">
    <p v-if="registerSuccess" class="text-red-600 text-center mt-2">
  {{ registerSuccess }}
</p></div>
    <div class="flex justify-center">
  <button
    type="submit"
    class="px-4 py-2 mt-5 bg-primary text-white font-bold   rounded">
    Submit
  </button>
</div>
 </Form>
</div>
</div>
</template>
<script setup lang="ts">
import { registerFormSchema } from "../schemas";
import { ref } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import { ErrorMessage, Field, Form } from "vee-validate";
import { useRouter } from "vue-router";
import kanbanStore from "../stores/Kanbanstore"
const registerForm = ref();
const registerSuccess = ref("");
const router = useRouter();

let validationSchema = toTypedSchema(registerFormSchema);
function onSubmit(values: { email: string; password: string }) {
    kanbanStore.register(values.email,values.password) .then(result => {
      registerSuccess.value = "User registered successfully!";
      setTimeout(() => {
      router.push("/login");
    }, 2000);
        })
        .catch(error => {
          registerSuccess.value = "User registration failed!";
    
            // Your callback logic here
        });
}
</script>
<style scoped>
.bg-primary {
  background-color: #16a34a;
}
</style>