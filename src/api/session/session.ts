

import type { Axios } from 'axios'

import type { Type__Client_To_Server__Session__POST } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session__POST'
import type { Type__Client_To_Server__Session__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session__PATCH'






// __________________________________________________ Session __________________________________________________

export async function get__session(
	axiosPrivate: 	Axios, 
	session_id: 	number, 
) {
	return axiosPrivate.get(`/session?session_id=${session_id}`).then(({ data }) => data)
}

export async function post__session(
	axiosPrivate: 	Axios, 
	json: 			Type__Client_To_Server__Session__POST, 
) {
	return axiosPrivate.post('/session', json).then(({ data }) => data)
}

export async function patch__session(
	axiosPrivate: 	Axios, 
	json: 			Type__Client_To_Server__Session__PATCH, 
) {
	return axiosPrivate.patch('/session', json).then(({ data }) => data)
}

export async function delete__session(
	axiosPrivate: 	Axios, 
	session_id: 	number, 
) {
	return axiosPrivate.delete(`/session?session_id=${session_id}`).then(({ data }) => data)
}





// __________________________________________________ Session Custom Date __________________________________________________

export async function patch__session_date(
	axiosPrivate: 	Axios, 
	json:			
) {
	return axiosPrivate.patch('/session/date', json).then(({ data }) => data)
}





// __________________________________________________ Session Env_Variables __________________________________________________

export async function get__session_env_variables(
	axiosPrivate: 	Axios, 
) {
	return axiosPrivate.get('/session/env').then(({ data }) => data)
}





// __________________________________________________ List of sessions __________________________________________________

export function get__sessions_list(
	axiosPrivate: 	Axios, 
) {
	return axiosPrivate.get('/session/all').then(({ data }) => data)
}
