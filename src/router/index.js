import {
	createRouter,
	createWebHistory
} from 'vue-router'
import list from'../views/list.vue'
import couriers from'../views/couriers.vue'

const router = createRouter({
	history: createWebHistory(
		import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			component: () => import('../views/enter.vue'),
			redirect: '/login',
			children: [{
					path: 'login',
					name:'login',
					component: () => import('../views/login.vue'),
				}
			]
		},
		{
			path: '/list',
			component:list
		},
		{
			path: '/couriers',
			component:couriers
		},
		]
})

export default router
