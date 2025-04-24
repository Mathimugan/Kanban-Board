<script setup lang="ts">

import { RouterView } from "vue-router";
</script>

<template>
  <div class="flex flex-col w-full h-full">  
<router-view />
  </div>
</template>
<style>
#app {
  @apply select-none h-screen bg-gray-300;
}
</style>
