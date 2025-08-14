<template>
  <div
    class="relative min-h-screen bg-black text-white flex items-center justify-center"
  >
    <Starfield />

    <div
      class="relative z-10 w-full max-w-[768px] min-h-screen grid grid-cols-1 items-center p-4"
    >
      <div
        class="flex flex-col flex-1 rounded-2xl p-4 gap-4 bg-neutral-50/5 backdrop-blur-xs border border-white/20 shadow-lg h-[90dvh]"
      >
        <ChatWindow
          :messages="messages"
          @send="sendMessage"
          @retry="retryMessage"
        />

        <ChatInput @send="sendMessage" />
      </div>

      <!-- Footer -->
      <footer
        class="relative z-10 w-full text-center pt-2 text-gray-400 text-sm"
      >
        © 2025 Renzo Viñas. All rights reserved.
      </footer>
    </div>
  </div>
</template>

<script setup>
import Starfield from "./components/Starfield.vue";
import ChatWindow from "./components/ChatWindow.vue";
import ChatInput from "./components/ChatInput.vue";
import { ref } from "vue";

const messages = ref([
  { sender: "bot", text: "Hello! I am SpaceBot. Ask me anything about space!" },
]);

const isLoading = ref(false);

// Helper function for retrying fetch requests
async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw err;
      }
    }
  }
}

const retryMessage = async (msg) => {
  if (!msg.originalText) return;

  msg.text = "⏳ Retrying...";
  msg.loading = true;
  msg.error = false;

  try {
    const data = await fetchWithRetry(
      "/api/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg.originalText }),
      },
      3,
      1000
    );

    msg.text = data.reply;
  } catch (err) {
    msg.text = `Error: ${err.message}. Please try again later.`;
    msg.error = true;
  } finally {
    msg.loading = false;
  }
};

// Send a chat message
const sendMessage = async (text) => {
  if (!text.trim()) return;

  messages.value.push({ sender: "user", text });
  const messageIndex = messages.value.length;
  messages.value.push({
    sender: "bot",
    text: "SpaceBot is thinking...",
    loading: true,
    originalText: text,
  });

  isLoading.value = true;

  try {
    const data = await fetchWithRetry("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    messages.value[messageIndex].text = data.reply;
    messages.value[messageIndex].loading = false;
  } catch (err) {
    const errorMessage =
      err instanceof TypeError
        ? "Cannot reach server. Check your internet connection."
        : err.message
        ? `Error: ${err.message}`
        : "Something went wrong. Please try again later.";

    messages.value[messageIndex].text = errorMessage;
    messages.value[messageIndex].loading = false;

    // Set error flag and store text for retry
    messages.value[messageIndex].error = true;

    console.error("Chat API error:", err);
  } finally {
    isLoading.value = false;
  }
};
</script>
