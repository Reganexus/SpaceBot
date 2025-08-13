<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const userInput = ref('')
const emit = defineEmits(['send'])

const send = () => {
  if (userInput.value.trim()) {
    emit('send', userInput.value)
    userInput.value = ''
  }
}
</script>

<template>
  <div class="relative w-full border-t border-gray-700">
    <textarea
      v-model="userInput"
      class="w-full bg-gray-800 text-white rounded-lg h-12 p-3 pr-12 mt-2 resize-none focus:outline-none"
      rows="1"
      placeholder="Send your thoughts here"
      @keydown.enter.prevent="send"
    ></textarea>

    <!-- Send icon inside textarea -->
    <button
      @click="send"
      class="absolute top-1/2 right-4 -translate-y-1/2 text-white hover:text-blue-400 transition"
      title="Send"
    >
      <Icon icon="mdi:send" class="text-2xl" />
    </button>
  </div>
</template>
