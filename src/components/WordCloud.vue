<template>
  <div ref="cloudRef" class="w-full h-full" />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import * as d3 from 'd3'
import cloud from 'd3-cloud'

// Accept words from parent: [{ text: 'example', count: 3 }]
const props = defineProps({
  words: {
    type: Array,
    default: () => []
  }
})

const cloudRef = ref(null)

const draw = (wordsData) => {
  const width = window.innerWidth
  const height = window.innerHeight

  const svg = d3.select(cloudRef.value)
    .html('') // clear previous render
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const group = svg.append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  cloud()
    .size([width, height])
    .words(
      wordsData.map(d => ({
        text: d.text,
        size: 30+d.count*10 // convert count to size
      }))
    )
    .padding(5)
    .rotate(() => ~~(Math.random() * 2) * 90)
    .font('Impact')
    .fontSize(d => d.size)
    .on('end', drawnWords => {
      group.selectAll('text')
        .data(drawnWords)
        .enter()
        .append('text')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', 'Impact')
        .style('fill', () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text(d => d.text)
    })
    .start()
}

// Watch for word updates and redraw
watch(() => props.words, (newWords) => {
  draw(newWords)
}, { immediate: true })

// Re-render on resize
onMounted(() => {
  window.addEventListener('resize', () => draw(words))
})
</script>

<style scoped>
div {
  overflow: hidden;
}
</style>
