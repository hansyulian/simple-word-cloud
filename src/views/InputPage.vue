<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="4">
          <v-card-title class="text-h5">📨 Submit a Word</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="word"
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
import { ref, onMounted } from 'vue'
import { useUserId } from '../composables/useUserId'
import { request } from '../utils/request';

const word = ref('');
const userId = useUserId()
const myWords = ref([]);

const reloadMyWords = async () => {
  const result = await request('get',`words?userId=${userId}`);
  myWords.value = result;
}

onMounted(() => {
  console.log('User ID:', userId);
  reloadMyWords();
})

const submitWord = async () => {
  if (!word.value) return;

  const res = await request('post','words', {
    json: { word: word.value, userId },
  })

  word.value = '';
  reloadMyWords();
}

const removeWord = async (id) => {
  const res = await request('delete',`words/${id}`, {
    method: 'DELETE',
  })
  reloadMyWords();
}
</script>
