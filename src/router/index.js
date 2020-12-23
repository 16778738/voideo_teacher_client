import Vue from 'vue'
import Router from 'vue-router'
import Home from "../components/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import Course from "../components/Course";
import CourseDetail from "../components/CourseDetail";
import Cart from "../components/Cart";
import Order from "../components/Order";
import OrderSuccess from "../components/OrderSuccess";

Vue.use(Router)

export default new Router({
    mode:'history',
    routes: [
        {path: "/home", component: Home},
        {path: "/login", component: Login},
        {path: "/register", component: Register},
        {path: "/course", component: Course},
        {path: "/detail/:id", component: CourseDetail},
        {path: "/cart", component: Cart},
        {path: "/order", component: Order},
        {path: "/payments/result", component: OrderSuccess},
        {path: "/", redirect: "/home"},

    ]
})
