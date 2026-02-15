<template>
  <h2>Работа с DTO</h2>
  <button @click="router.push('/')">Назад</button>

  <hr />

  <h3>Create:</h3>
  <pre>{{ userDtoCreate }}</pre>

  <form>
    <input v-model="userDtoCreate.name" type="text" />
    <input v-model.number="userDtoCreate.age" type="number" />
    <input v-model.number="userDtoCreate.score" type="number" />

    <button type="button">Save</button>
  </form>

  <hr />

  <h3>Update:</h3>
  <h4>toJSON:</h4>
  <pre>{{ userDtoUpdate }}</pre>

  <ul>
    <li>hasChanged: {{ userDtoUpdate.hasChanged() }}</li>
    <li>dirtyFields: {{ userDtoUpdate.getDirtyFields() }}</li>
  </ul>

  <form>
    <input v-model="userDtoUpdate.name" type="text" />
    <input v-model="userDtoUpdate.config_status.name" type="text" />
    <input v-model.number="userDtoUpdate.age" type="number" />
    <input v-model.number="userDtoUpdate.score" type="number" />

    <button type="button" @click="() => (userDtoUpdate.config_status.name = 'Jane Smith')">
      Mutate config_status obj
    </button>

    <button type="button" @click="userDtoUpdate.commitChanges()">Commit form DTO</button>
    <button type="button" @click="userDtoUpdate.resetChanges()">Reset form DTO</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { UserDtoCreate, UserDtoUpdate } from '../../core/domain';

const router = useRouter();

const userDtoCreate = ref<UserDtoCreate>(new UserDtoCreate());
const userDtoUpdate = ref<UserDtoUpdate>(
  new UserDtoUpdate({
    name: null,
    age: null,
    score: null,
    config_status: {
      name: null,
      title: null,
      description: null,
    },
  }),
);
</script>
