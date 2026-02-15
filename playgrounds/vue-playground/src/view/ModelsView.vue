<template>
  <h2>Работа с моделями</h2>
  <button @click="router.push('/')">Назад</button>

  <hr />

  <h2>Filled</h2>
  <ul>
    <li>isUserNull: {{ filledUser.isUserNull() }}</li>
    <li>isAgeNull: {{ filledUser.isAgeNull() }}</li>
    <li>isPropertyNull('age'): {{ filledUser.isPropertyNull('age') }}</li>
  </ul>

  <pre>
    {{ filledUser }}
  </pre>

  <hr />

  <h2>Nulled</h2>
  <ul>
    <li>isUserNull: {{ nulledUser.isUserNull() }}</li>
    <li>isAgeNull: {{ nulledUser.isAgeNull() }}</li>
    <li>isPropertyNull('age'): {{ nulledUser.isPropertyNull('age') }}</li>
  </ul>

  <pre>
    {{ nulledUser }}
  </pre>

  <input v-model.number="nulledUser.age" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { UserModel } from '../../core/domain';

const router = useRouter();

const filledUser = ref(
  new UserModel({
    id: 1,
    name: 'Иван Иванов',
    age: 25,
    email: 'ivan@example.com',
    phoneNumber: 'ivan@+7-999-123-45-67',
    score: 95.5,
    isActive: true,
    config_status: {
      name: 'status_name',
      title: 'status_title',
      description: 'status_desc',
    },
    last_error_details: {},
  }),
);

const nulledUser = ref(
  new UserModel({
    id: null,
    name: null,
    age: null,
    email: null,
    phoneNumber: null,
    score: null,
    isActive: true,
    config_status: {
      name: null,
      title: null,
      description: null,
    },
    last_error_details: {},
  }),
);
</script>
