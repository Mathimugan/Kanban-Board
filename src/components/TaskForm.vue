<template>
  <Form
    ref="taskForm"
    :validation-schema="validationSchema"
    @submit="onSubmit"
    class="flex flex-col gap-2"
  >
    <label for="name">Name</label>
    <Field
      id="name"
      type="text"
      name="name"
      class="p-2 border-2 rounded-sm border-gray-300"
    />
    <ErrorMessage name="name" class="text-red-700" />
    <label for="description">Description</label>
    <Field
      id="description"
      type="text"
      name="description"
      class="p-2 border-2 rounded-sm border-gray-300"
    />
    <ErrorMessage name="description" class="text-red-700" />
    <div class="flex justify-center">
  <button
    type="submit"
    class="px-4 py-2 mt-5 bg-primary text-white font-bold  rounded">
    Submit
  </button>
</div>
 </Form>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import { ErrorMessage, Field, Form } from "vee-validate";
import { taskFormSchema } from "../schemas"
import KanbanStore from "../stores/KanbanStore";
import { ACTIONS, type Column, type Task } from "../types";

const emit = defineEmits<{
  (e: "close-modal"): void;
}>();

const props = defineProps<{
  columnId: Column["columnId"];
  task?: Task;
  action: ACTIONS;
}>();

const taskForm = ref();

onMounted(() => {
  if (props.action === ACTIONS.UPDATE_TASK) {
    taskForm.value.setFieldValue("name", props.task?.name);
    taskForm.value.setFieldValue("description", props.task?.description);
  }
});

let validationSchema = toTypedSchema(taskFormSchema);

function onSubmit(values: any) {
  if (props.action === ACTIONS.ADD_TASK) {
    KanbanStore.addTaskToColumn(props.columnId, {
      name: values.name,
      description: values.description,
    });
  } else if (props.action === ACTIONS.UPDATE_TASK && props.task) {
    let updatedTask = {
      taskId: props.task.taskId,
      name: values.name,
      description: values.description,
    };

    KanbanStore.updateTask(props.columnId, updatedTask);
  }
  emit("close-modal");
}
</script>
<style scoped>
.bg-primary {
  background-color: #16a34a;
}
</style>