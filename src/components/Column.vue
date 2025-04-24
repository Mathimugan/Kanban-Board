<template>
  <DropZone @drop-data="onDrop">
    <Draggable
      :transfer-data="{
        columnId: column.columnId,
        type: TYPES.COLUMN,
      }"
      class="w-full sm:w-[22rem] h-full border p-2 sm:p-4 rounded-2xl bg-white"
    >
      <div class="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2">
        <div class="flex flex-col sm:flex-row sm:justify-between bg-gray-200 w-full p-3 sm:p-4 rounded-lg gap-2 items-start sm:items-center">
          <span class="font-bold text-base sm:text-lg">{{ column.name }}</span>

          <div class="flex flex-wrap gap-2 sm:gap-2 px-2 sm:px-4">
            <button @click="setSelectedColumn(ACTIONS.UPDATE_COLUMN, column)" class="px-2 py-1 bg-primary text-white rounded text-sm sm:text-base">
              <Pencil class="w-4 h-4" />
            </button>
            <button @click="setSelectedColumn(ACTIONS.DELETE_COLUMN, column)" class="px-2 py-1 bg-primary text-white rounded text-sm sm:text-base">
              <X class="w-5 h-5" />
            </button>
            <button @click="addTask(column.columnId)" class="px-2 py-1 bg-primary text-white rounded text-sm sm:text-base">
              <Plus class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 overflow-y-auto h-[60vh] sm:h-[35rem] p-2">
        <Task
          v-for="task of column.tasks"
          :column-id="column.columnId"
          :task="task"
          :key="task.taskId"
        />
      </div>
    </Draggable>
  </DropZone>

  <!-- Update Column Modal -->
  <Modal
    :is-modal-active="isUpdateColumnModalActive"
    :heading="`${ACTIONS.UPDATE_COLUMN.split('_').join(' ')}`"
    @close-modal="toggleUpdateColumnModal()"
  >
    <ColumnForm
      :action="ACTIONS.UPDATE_COLUMN"
      :column="column"
      @close-modal="toggleUpdateColumnModal()"
    />
  </Modal>

  <!-- Delete Column Modal -->
  <Modal
    :is-modal-active="isDeleteColumnModalActive"
    :heading="`${ACTIONS.DELETE_COLUMN.split('_').join(' ')}`"
    @close-modal="toggleDeleteColumnModal"
  >
    <div class="p-2">
      <span>Are you sure you want to delete {{ column && column.name }}?</span>
      <div class="flex flex-col sm:flex-row justify-around pt-3 gap-2">
        <button @click="toggleDeleteColumnModal()" class="px-4 py-2 w-full sm:w-32 bg-gray-200 text-black font-bold rounded">No</button>
        <button @click="deleteColumn" class="px-4 py-2 w-full sm:w-32 bg-primary text-white font-bold rounded">Yes</button>
      </div>
    </div>
  </Modal>

  <!-- Add Task Modal -->
  <Modal
    :is-modal-active="isTaskModalActive"
    :heading="`${ACTIONS.ADD_TASK.split('_').join(' ')}`"
    @close-modal="toggleTaskModal()"
  >
    <TaskForm
      :column-id="selectedColumnId"
      :action="ACTIONS.ADD_TASK"
      @close-modal="toggleTaskModal()"
    />
  </Modal>
</template>
<script setup lang="ts">
import { ACTIONS, TYPES, type Column, type TRANSFER_DATA } from "@/types";
import Draggable from "./common/Draggable.vue"
import DropZone from "./common/DropZone.vue";
import { ref } from "vue";
import ColumnForm from "./ColumnForm.vue";
import TaskForm from "./TaskForm.vue";
import Modal from "./common/Modal.vue";
import kanbanStore from "@/stores/kanbanStore";
import Task from "./Task.vue";
import { X , Plus, Pencil} from 'lucide-vue-next'
const props = defineProps<{
  column: Column;
}>();

const isUpdateColumnModalActive = ref(false);
const isDeleteColumnModalActive = ref(false);
const selectedColumn = ref<Column | null>(null);

function onDrop(transferData: TRANSFER_DATA) {
  if (transferData.type === TYPES.COLUMN && transferData.columnId) {

  } else if (transferData.type === TYPES.TASK && transferData.taskId) {
    kanbanStore.moveTask(transferData.taskId, props.column.columnId!);
  }
}

function setSelectedColumn(action: ACTIONS, column: Column) {
  selectedColumn.value = column;
  if (action === ACTIONS.UPDATE_COLUMN) {
    toggleUpdateColumnModal();
  } else if (action === ACTIONS.DELETE_COLUMN) {
    toggleDeleteColumnModal();
  }
}

function deleteColumn() {
  if (selectedColumn.value) {
    kanbanStore.deleteColumn(selectedColumn.value?.columnId);
  }
}

function toggleUpdateColumnModal() {
  isUpdateColumnModalActive.value = !isUpdateColumnModalActive.value;
}

function toggleDeleteColumnModal() {
  isDeleteColumnModalActive.value = !isDeleteColumnModalActive.value;
}

let selectedColumnId = ref("");
const isTaskModalActive = ref(false);

function addTask(columnId: Column["columnId"]) {
  selectedColumnId.value = columnId;
  toggleTaskModal();
}

function toggleTaskModal() {
  isTaskModalActive.value = !isTaskModalActive.value;
}

</script>

<style scoped>
.bg-primary {
  background-color: #16a34a;
}
</style>