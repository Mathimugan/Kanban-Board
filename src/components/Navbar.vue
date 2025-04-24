<template>
  <div class="flex flex-col sm:flex-row justify-between items-center mt-10 px-2 mb-3 text-white">

    <h1 class="font-bold text-2xl sm:text-3xl text-black mb-4 sm:mb-0">Kanban Board</h1>

   
    <div class="flex flex-wrap gap-4 sm:gap-5 sm:flex-nowrap items-center">
      <button
        class="text-sm sm:text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary h-12 py-2 rounded-3xl px-4 sm:px-5"
        @click="isColumnModalActive = !isColumnModalActive"
      >
        Add Column
      </button>

      <button
        @click="onSubmit"
        class="text-sm sm:text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary h-12 py-2 rounded-3xl px-4 sm:px-5"
      >
        Logout
      </button>
    </div>
  </div>


  <Modal
    :is-modal-active="isColumnModalActive"
    :heading="`${ACTIONS.ADD_COLUMN.split('_').join(' ')}`"
    @close-modal="isColumnModalActive = !isColumnModalActive"
  >
    <ColumnForm
      :action="ACTIONS.ADD_COLUMN"
      @close-modal="isColumnModalActive = !isColumnModalActive"
    />
  </Modal>
</template>
<script setup lang="ts">
import { ref } from "vue";
import ColumnForm from "./ColumnForm.vue";
import Modal from "../components/common/Modal.vue"
import { ACTIONS} from "../types"
import KanbanStore from "../stores/KanbanStore";
import { useRouter } from "vue-router";
const router = useRouter();
const isColumnModalActive = ref(false);
async function onSubmit() {
  try {
  
    await KanbanStore.logout();
    router.push("/login");
  } catch (error) {
    console.error("Login failed:", error);


  }
}
</script>
<style scoped>
.bg-primary {
  background-color: #16a34a;
}

</style>