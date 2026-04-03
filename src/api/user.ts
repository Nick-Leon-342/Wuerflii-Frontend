

import { api } from './axios'

import type { Type__Client_To_Server__User__PATCH } from '../types/Type__Client_To_Server/Type__Client_To_Server__User__PATCH'
import type { Type__User } from '../types/Type__User'





export async function get__user(): Promise<Type__User> {
	return api.get('/user').then(({ data }) => data)
}

export async function patch__user(
	json:	Type__Client_To_Server__User__PATCH, 
): Promise<undefined> {
	return api.patch('/user', json).then(({ data }) => data)
}
