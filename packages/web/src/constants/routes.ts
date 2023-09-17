import Home from '@/pages/home/Home.vue';
import Login from '@/pages/login/Login.vue';
import ContainerDetail from '@/pages/containerDetail/ContainerDetail.vue';
import CreateContainer from '@/pages/createContainer/CreateContainer.vue';

export const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/container/:id', component: ContainerDetail },
    { path: '/container/new', component: CreateContainer },
];
