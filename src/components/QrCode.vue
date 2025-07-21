<!-- components/QrCode.vue -->
<template>
  <div class="qr-container">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  text: { type: String, required: true },
  size: { type: Number, default: 200 },
})

const canvasRef = ref(null)

const render = () => {
  if (canvasRef.value && props.text) {
    QRCode.toCanvas(canvasRef.value, props.text, {
      width: props.size,
      margin: 1,
    })
  }
}

watch(() => props.text, render)
onMounted(render)
</script>

<style scoped>
</style>
