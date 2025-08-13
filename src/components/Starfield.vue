<script setup>
import { onMounted, ref } from 'vue'

const stars = ref([])

onMounted(() => {
  const starArray = []
  const numberOfStars = 300

  for (let i = 0; i < numberOfStars; i++) {
    const size = Math.random() * 3 + 1
    const xPos = Math.random() * 100
    const yPos = Math.random() * 100

    starArray.push({
      size: `${size}px`,
      left: `${xPos}vw`,
      top: `${yPos}vh`
    })
  }

  stars.value = starArray
})
</script>

<template>
  <div class="stars fixed inset-0 overflow-hidden">
    <div
      v-for="(star, index) in stars"
      :key="index"
      class="star absolute rounded-full bg-gray-400 shadow"
      :style="{
        width: star.size,
        height: star.size,
        left: star.left,
        top: star.top
      }"
    ></div>
  </div>
</template>

<style scoped>
.star {
  box-shadow: 0 0 10px #808080;
  animation: twinkle 2s infinite alternate;
}

@keyframes twinkle {
  0% { opacity: 0.2; }
  100% { opacity: 1; }
}

.stars {
  animation: zoom 50s infinite alternate;
}

@keyframes zoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.5); }
}
</style>
