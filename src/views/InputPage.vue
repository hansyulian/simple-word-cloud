<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="4">
          <v-card-title class="text-h5">Your answer:</v-card-title>
          
          <v-card-text>
            <v-radio-group v-model="selectedWord">
            <v-radio
              :label="option"
              :value="option"
              v-for="option in wordOptions"
              :key="option"
              class="ma-0 pa-0"
              dense
            />
            </v-radio-group>
            <v-text-field
              v-if="enableFreeText"
              v-model="wordInput"
              label="Enter a word"
              outlined
              dense
            />
            <v-btn
              type="submit"
              color="primary"
              block
              class="mt-4"
              @click="submitWord"
            >
              Submit
            </v-btn>
            <v-divider class="my-4"></v-divider>

            <div v-if="myWords.length">
              <v-list >
                <v-list-item
                  v-for="word in myWords"
                  :key="word.id"
                  class="d-flex align-center justify-space-between w-full"
                >
                  <v-btn
                    icon
                    color="red"
                    @click="removeWord(word.id)"
                    variant="text"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <span>{{ word.text }}</span>
                </v-list-item>
              </v-list>
            </div>
            <div v-else>
              <p class="mt-4 text-grey">No words submitted yet.</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUserId } from '../composables/useUserId'
import { request } from '../utils/request';
import { appConfig } from '../config';

const wordInput = ref('');
const userId = useUserId()
const myWords = ref([]);
const intervalRef = ref();
const enableFreeText = appConfig.enableFreeText
const wordOptions = appConfig.wordOptions
const enableMulti = appConfig.enableMulti
const selectedWord = ref('');




const reloadMyWords = async () => {
  const result = await request('get',`words?userId=${userId}`);
  myWords.value = result;
}

onMounted(() => {
  console.log('User ID:', userId);
  reloadMyWords();
  intervalRef.value = setInterval(reloadMyWords,5000);
})

onUnmounted(()=>{
  clearInterval(intervalRef.value);
})


const submitWord = async () => {
  const hasCustomWord = enableFreeText && !!wordInput.value;
  const hasSelectedWord = !!selectedWord.value;
  console.log(hasCustomWord, hasSelectedWord, wordInput.value, selectedWord.value);
  if (!hasCustomWord && !hasSelectedWord) return;

  if (!enableMulti){
    await myWords.value.map((word) => {
      request('delete',`words/${word.id}`, {
        method: 'DELETE',
      })
    })
  }

  const res = await request('post','words', {
    json: { word: selectedWord.value || wordInput.value, userId },
  })


  wordInput.value = '';
  reloadMyWords();
}

const removeWord = async (id) => {
  const res = await request('delete',`words/${id}`, {
    method: 'DELETE',
  })
  reloadMyWords();
}
</script>
