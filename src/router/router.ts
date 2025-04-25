// import {
//     createRouter,
//     createWebHashHistory,
//     createWebHistory,
//     RouteRecordRaw,

// } from "vue-router";
// // 尝试安装 vue-router 以解决找不到模块的问题，若已安装，检查 tsconfig.json 中的路径配置
// // 这里假设已经安装，使用相对路径可能需要调整，这里保持原导入方式
// let prod = import.meta.env.PROD;

// const routes: Array<RouteRecordRaw> = [
//     {
//     path: "/",
//     component: () => import("../pages/index/Index.vue"),
//     },
//     {
//     name: "NewPage",
//     path: "/NewPage",
//     component: () => import("../pages/pageThree/Index.vue"),
//     },
//     {
//     name: "ClassificationAddEdit",
//     path: "/Classification/AddEdit",
//     component: () => import("../pages/classification/AddEdit.vue"),
//     }
// ];

// const router = createRouter({
//     history: prod ? createWebHashHistory() : createWebHistory(),
//     routes,
// });

// export default router;
