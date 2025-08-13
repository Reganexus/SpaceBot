<script setup>
import { onUpdated, ref } from "vue";

const props = defineProps({
  messages: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["send"]);

const chatContainer = ref(null);
const showRecommendations = ref(true);

onUpdated(() => {
  // Auto-scroll to bottom
  if (chatContainer.value) {
    chatContainer.value.scrollTo({
      top: chatContainer.value.scrollHeight,
      behavior: "smooth",
    });
  }

  if (
    props.messages.length > 1 && // more than the bot greeting
    props.messages[props.messages.length - 1].sender === "user"
  ) {
    showRecommendations.value = false;
  }
});

const renderMessage = (text) => {
  let escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  escaped = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  escaped = escaped.replace(/\*(.+?)/g, "•");
  escaped = escaped.replace(/\n/g, "<br>");
  return escaped;
};

const recommendations = [
  { title: "🌌 Show Planets", description: "List all planets in the Solar System", text: "Can you list all the planets in the Solar System?" },
  { title: "✨ Show Stars", description: "List some bright stars", text: "Can you list some bright stars?" },
  { title: "🪐 Exoplanets", description: "Show interesting exoplanets", text: "Can you tell me about interesting exoplanets?" },
  { title: "🚀 Space Facts", description: "Give me a random space fact", text: "Give me a random space fact" },
];

const handleRecommendationClick = (text) => {
  showRecommendations.value = false;
  emit("send", text);
};
</script>

<template>
  <div class="relative flex-1 flex flex-col h-[80dvh] overflow-hidden">
    <!-- Sticky Header -->
    <div class="sticky top-0 z-10 bg-gray-900 mb-4 rounded-xl">
      <div
        class="flex items-center gap-3 p-3 border-b border-gray-700 rounded-xl"
      >
        <img
          src="../assets/astro.jpg"
          alt="SpaceBot"
          class="w-10 h-10 rounded-full"
        />
        <div class="flex flex-col">
          <span class="font-bold text-white">SpaceBot</span>
          <span class="text-sm text-gray-400">
            Your AI companion for all things space!
          </span>
        </div>
      </div>
    </div>

    <!-- Chat Messages -->
    <div
      ref="chatContainer"
      class="flex-1 flex flex-col gap-4 p-2 overflow-y-auto relative [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="flex"
        :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          :class="[
            'p-3 rounded-lg max-w-[70%] break-words whitespace-pre-wrap',
            msg.sender === 'bot' ? 'bg-gray-800 text-white' : 'bg-blue-600 text-white'
          ]"
          v-html="renderMessage(msg.text)"
        ></div>
      </div>

      <!-- Recommendations -->
      <div v-if="showRecommendations" class="absolute left-0 bottom-0 w-full overflow-hidden grid md:grid-cols-2 grid-cols-1 gap-2 md:px-8 px-2">
        <button
          v-for="(card, i) in recommendations"
          :key="i"
          class="bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg p-3 text-left transition-colors"
          @click="handleRecommendationClick(card.text)"
        >
          <strong>{{ card.title }}</strong>
          <p class="text-xs text-gray-400 mt-1">{{ card.description }}</p>
        </button>
      </div>
    </div>
  </div>
</template>
