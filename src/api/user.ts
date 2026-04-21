

import { api } from './axios'

import type { Type__User, Type__User_PATCH } from '@/types/Zod__User'





export async function get__user(): Promise<Type__User> {
	return api.get('/user').then(({ data }) => data)
}

export async function patch__user(
	json:	Type__User_PATCH, 
): Promise<undefined> {
	return api.patch('/user', json).then(({ data }) => data)
}

export async function delete__user() {
	return api.delete('/user')
}
