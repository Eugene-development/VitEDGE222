<template>
  <p>fnsbdfksmbkfjg</p>
<!--  {{n}}-->
  test-{{double}} <br>
  <p class="bg-red-100">test2-{{axi}}</p><br>
  <p class="bg-blue-100">test3-{{axiosUsers}}</p>
  <br>
  <p class="bg-green-100">test3-{{axiosMain}}</p>
  <br>

<!--  <button class="bg-red-800" @click="changeMe">Click me</button>-->
<!--  <button class="bg-red-800" @click="getPosts">Click Axios</button>-->
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCounter } from "../stores/counter";
const main = useCounter();
const { double, axi, axiosUsers, axiosMain } = storeToRefs(main)
</script>

<script>
import { useCounter } from "../stores/counter";
export default {
  beforeMount() {
    // In browser
    const { getPosts } = useCounter(this.$pinia);
    getPosts();
  },
  async serverPrefetch() {
    // During SSR
    const { getPosts } = useCounter(this.$pinia);
    await getPosts();
  }
}
</script>
