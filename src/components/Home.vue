<script setup lang="ts">
import { getColumns, STORE, subscribeToColumns } from "../stores/kanbanStore";
import { onMounted, ref } from "vue";
import { type ColumnType } from "../types";
import Navbar from "../components/Navbar.vue";
import Column from "../components/Column.vue";

const columns = ref<ColumnType[]>([]);

onMounted(async () => {
  columns.value = await getColumns();
  subscribeToColumns((updatedColumns: ColumnType[]) => {
    columns.value = updatedColumns;  // Update columns whenever there's a change
  });
});
</script>

<template>
  <div class="flex flex-col w-full h-full">
  
    <Navbar :boards="STORE" @select-board="selectBoard" />

    <div class="border bg-white text-card-foreground shadow-none p-7 rounded-3xl px-4 sm:px-7 flex flex-col gap-8">
      
  
      <div v-if="columns.length" class="flex-1 flex gap-4 px-2 sm:px-3 overflow-x-auto">
        <div class="flex gap-4 sm:gap-6 flex-nowrap w-full">
          <Column
            v-for="column in columns"
            :key="column.columnId"
            :column="column"
            class="flex-shrink-0 w-full sm:w-auto"
          />
        </div>
      </div>
      <div v-else class="text-center text-gray-500">No board selected</div>  
    </div>
  </div>
</template>

<style scoped>

.sm\:px-7 {
  padding-left: 1.75rem;
  padding-right: 1.75rem;
}


.overflow-x-auto {
  overflow-x: auto;
}


@media (max-width: 640px) {
  .flex-1 {
    flex-grow: 1;
  }

  .sm\:gap-6 {
    gap: 1rem;
  }
}
</style>
