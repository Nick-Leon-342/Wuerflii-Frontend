

import { api } from './axios'

import type { Type__Game } from '@/types/Zod__Game'





export async function get__game(
	session_id:		number
) {
	return api.get(
		'/game', 
		{ params: { session_id } }
	).then(({ data }) => data)
}

export async function post__game(
	session_id:		number, 
	json:			Type__Game
) {
	return api.post(
		'/game', 
		json, 
		{ params: { session_id } }
	).then(({ data }) => data)
}

export async function delete__game(
	session_id:		number
) {
	return api.delete(
		'/game', 
		{ params: { session_id } }
	).then(({ data }) => data)
}
