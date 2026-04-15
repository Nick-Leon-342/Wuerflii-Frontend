

import { api } from '../axios'

import type { Type__Player_List, Type__Player_List__PATCH, Type__Player_List__POST } from '@/types/Zod__Player'





export async function get__session_players(
	session_id:	number,
): Promise<Type__Player_List> {
	return api.get(
		'/session/players', 
		{ params: { session_id } }
	).then(({ data }) => data)
}

export async function post__session_players(
	session_id:		number, 
	List__Players:	Type__Player_List__POST, 
): Promise<Type__Player_List> {
	return api.post(
		'/session/players', 
		{ List__Players }, 
		{ params: { session_id } }, 
	).then(({ data }) => data)
}

export async function patch__session_players(
	session_id:		number, 
	List__Players:	Type__Player_List__PATCH, 
): Promise<null> {
	return api.patch(
		'/session/players', 
		{ List__Players }, 
		{ params: { session_id } }, 
	).then(({ data }) => data)
}
