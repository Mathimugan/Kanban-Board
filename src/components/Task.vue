<template>
  <DropZone @drop-data="onTaskDrop">
    <Draggable
      class="rounded-xl border bg-card text-card-foreground shadow-none mb-3 w-full"
      :transfer-data="{
        taskId: task.taskId,
        type: TYPES.TASK,
      }"
    >
     
      <div class="flex justify-end gap-2 flex-wrap sm:flex-nowrap px-3 pt-3">
        <button
          class="font-bold px-2 py-1 bg-primary text-white rounded text-sm sm:text-base"
          @click="toggleTaskModal()"
          title="Edit"
        >
          <Pencil class="w-4 h-4 text-white-500 cursor-pointer" />
        </button>
        <button
          class="font-bold px-2 py-1 bg-primary text-white rounded text-sm sm:text-base"
          @click="toggleDeleteTaskModal()"
          title="Delete"
        >
          <X class="w-5 h-5 text-white-500 cursor-pointer" />
        </button>
      </div>

  
      <div class="p-6 pt-0 flex flex-col gap-3 mt-1">
        <span class="font-bold text-lg sm:text-xl md:text-2xl">{{ task.name }}</span>
        <span class="text-sm text-gray-600 sm:text-base">{{ task.description }}</span>
      </div>
    </Draggable>
  </DropZone>


  <Modal
    :is-modal-active="isTaskModalActive"
    :heading="`${ACTIONS.UPDATE_TASK.split('_').join(' ')}`"
    @close-modal="toggleTaskModal()"
  >
    <TaskForm
      :column-id="columnId"
      :task="task"
      :action="ACTIONS.UPDATE_TASK"
      @close-modal="toggleTaskModal()"
    />
  </Modal>


  <Modal
    :is-modal-active="isDeleteTaskModalActive"
    :heading="`${ACTIONS.DELETE_TASK.split('_').join(' ')}`"
    @close-modal="toggleDeleteTaskModal()"
  >
    <div class="p-2">
      <span>Are you sure you want to delete {{ task && task.name }}?</span>
      <div class="flex flex-col sm:flex-row justify-around pt-3 gap-2">
        <button @click="toggleDeleteTaskModal()" class="px-4 py-2 w-full sm:w-32 bg-gray-200 text-black font-bold rounded">
          No
        </button>
        <button @click="deleteTask" class="px-4 py-2 w-full sm:w-32 bg-primary text-white font-bold rounded">
          Yes
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import {
  TYPES,
  type Column,
  type Task,
  ACTIONS,
  type TRANSFER_DATA,
} from "../types"
import Modal from "./common/Modal.vue";
import TaskForm from "./TaskForm.vue";
import { ref } from "vue";
import KanbanStore from "../stores/KanbanStore";
import DropZone from "./common/DropZone.vue";
import Draggable from "./common/Draggable.vue";
import { X , Pencil} from 'lucide-vue-next'

const props = defineProps<{
  task: Task;
  columnId: Column["columnId"];
}>();

const isTaskModalActive = ref(false);
const isDeleteTaskModalActive = ref(false);

function toggleTaskModal() {
  isTaskModalActive.value = !isTaskModalActive.value;
}

function toggleDeleteTaskModal() {
  isDeleteTaskModalActive.value = !isDeleteTaskModalActive.value;
}

function deleteTask() {
  KanbanStore.deleteTask(props.columnId, props.task.taskId);
  toggleDeleteTaskModal();
}

function onTaskDrop(transferData: TRANSFER_DATA) {
  if (transferData.type === TYPES.TASK && transferData.taskId) {
    KanbanStore.moveTask(
      transferData.taskId,
      props.columnId!,
      props.task.taskId
    );
  }
}
</script>

<style scoped>
.bg-primary {
  background-color: #16a34a;
}


@media (max-width: 640px) {
  .text-sm {
    font-size: 0.875rem;
  }

  .flex-wrap {
    flex-wrap: wrap;
  }


  .w-full {
    width: 100%;
  }

  .gap-2 {
    gap: 0.5rem;
  }
}

@media (min-width: 640px) {
  .sm\:text-base {
    font-size: 1rem;
  }

  .sm\:w-32 {
    width: 8rem; 
  }

  .sm\:flex-nowrap {
    flex-wrap: nowrap;
  }
}

@media (min-width: 768px) {
  .md\:text-2xl {
    font-size: 1.5rem;
  }

  .sm\:text-xl {
    font-size: 1.25rem;
  }
}
</style>
