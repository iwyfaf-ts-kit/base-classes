<template>
  <h2>Playground</h2>
  <button @click="router.push('/models')">Работа с моделями</button>
  <button @click="router.push('/dto')">Работа с DTO</button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
