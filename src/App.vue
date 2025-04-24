<script setup lang="ts">
import { onMounted, ref } from "vue";
import  { ColumnType } from "./types"; // Adjust the path to where ColumnType is defined
import { getColumns,subscribeToColumns  } from "./stores/kanbanStore";
import { RouterView } from "vue-router";
const columns = ref<ColumnType[]>([]);
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
