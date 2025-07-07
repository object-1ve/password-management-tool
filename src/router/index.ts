import {
    createRouter,
    createWebHashHistory,
    createWebHistory,
    RouteRecordRaw,

} from "vue-router";
let prod = import.meta.env.PROD;

const routes: Array<RouteRecordRaw> = [
    {
        name: "passwordManager",
        path: "/passwordManager",
    component: () => import("../pages/passwordManager/passwordManager.vue"),
    },
    {
        name: "shortCuts",
        path: "/shortCuts",
    component: () => import("../pages/instructions/instructions.vue"),
    }
];

const router = createRouter({
    history: prod ? createWebHashHistory() : createWebHistory(),
    routes,
});

export default router;
