import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../view/HomeView.vue';
import ModelsView from '../view/ModelsView.vue';
import DtoView from '../view/DtoView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/models', component: ModelsView },
  { path: '/dto', component: DtoView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
