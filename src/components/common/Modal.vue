<template>
  <Teleport to="body">
    <div
      v-if="isModalActive"
      class="w-full h-full absolute top-0 bg-black bg-opacity-30"
    >
      <div
        class="bg-white shadow-lg shadow-slate-900 fixed top-1/2 left-1/2 w-3/4 md:w-1/4 -translate-x-1/2 -translate-y-1/2 p-3 rounded-2xl"
      >
        <div class="flex justify-between">
          <span class="font-bold text-lg">{{ heading }}</span>
          <button @click="$emit('close-modal')">
            <X class="w-5 h-5 text-black-500 cursor-pointer" />
</button>
        </div>
        <div v-if="isModalActive" class="p-1">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
defineEmits<{
  (e: "close-modal"): void;
}>();

defineProps<{
  isModalActive: boolean;
  heading: string;
}>();

</script>
