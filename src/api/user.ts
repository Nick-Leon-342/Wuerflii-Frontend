

import type { Axios } from 'axios'
import type { Type__User } from '../types/Type__User'
import type { Type__Client_To_Server__User__PATCH } from '../types/Type__Client_To_Server/Type__Client_To_Server__User__PATCH'

export async function get__user(
	axiosPrivate:	Axios, 
): Promise<Type__User> {
	return axiosPrivate.get('/user').then(({ data }) => data)
}

export async function patch__user(
	axiosPrivate:	Axios,
	json:			Type__Client_To_Server__User__PATCH, 
): Promise<undefined> {
	return axiosPrivate.patch('/user', json).then(({ data }) => data)
}
