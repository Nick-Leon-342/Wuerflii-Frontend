

import { api } from './axios'

import type { Type__User_POST } from '@/types/Zod__User'





export async function post__registration(json: Type__User_POST) {
	return api.post(
		'/auth/registration', 
		json, 
		{
			headers: { 'Content-Type': 'application/json' },
			withCredentials: true
		}
	).then(({ data }) => data)
}

export async function post__login(json: Type__User_POST) {
	return api.post(
		'/auth/login', 
		json, 
		{
			headers: { 'Content-Type': 'application/json' },
			withCredentials: true
		}
	).then(({ data }) => data)
}

export async function delete__logout() {
	return api.delete('/auth/logout')
}
