<template>
  <div>
    <WordCloud :words="wordList" />
    <div class="action-container">
      <QrCode :text="qrUrl" />
      <v-btn color="red" @click="clearEverything">Clear all words</v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import WordCloud from '../components/WordCloud.vue'
import QrCode from '../components/QrCode.vue'
import { request } from '../utils/request'

const wordList = ref([])

// Set your target input URL for QR
const qrUrl = `${location.origin}/input`

const loadWords = async () => {
  const result = await request('get', `words`)
  const processedWords = result.map(w => ({ text: `${w.text} (${w.count})`, count: w.count }))
  if (JSON.stringify(processedWords) !== JSON.stringify(wordList.value)) {
    wordList.value = processedWords
  }
}

const clearEverything = async () => {
  await request('post','clear');
  await loadWords();
}

onMounted(() => {
  loadWords()
  setInterval(loadWords, 5000) // auto-refresh every 5s
})
</script>

<style scoped>

.action-container {
  position: fixed;
  bottom: 16px;
  right: 16px;
  background: white;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}
</style>