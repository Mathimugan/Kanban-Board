<template>
  <Form
    ref="columnForm"
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
import { columnFormSchema } from "../schemas";
import KanbanStore from "../stores/KanbanStore";
import { ACTIONS, type Column } from "../types";
import { toTypedSchema } from "@vee-validate/zod";
import { ErrorMessage, Field, Form } from "vee-validate";
import { onMounted, ref } from "vue";

const emit = defineEmits<{
  (e: "close-modal"): void;
}>();

const props = defineProps<{
  column?: Column;
  action: ACTIONS;
}>();

const columnForm = ref();

onMounted(() => {
  if (props.action === ACTIONS.UPDATE_COLUMN) {
    columnForm.value.setFieldValue("name", props.column?.name);
  }
});

let validationSchema = toTypedSchema(columnFormSchema);

function onSubmit(values: any) {
  if (props.action === ACTIONS.ADD_COLUMN) {
    KanbanStore.addColumn(values.name);
  } else if (props.action === ACTIONS.UPDATE_COLUMN) {
    KanbanStore.updateColumn({
      columnId: props.column?.columnId!,
      name: values.name,
    });
  }
  emit("close-modal");
}
</script>
<style scoped>
.bg-primary {
  background-color: #16a34a;
}
</style>