

import { api } from './axios'

import type { Type__Gnadenwurf } from '../types/Zod__Gnadenwurf'





export async function patch__gnadenwurf(
	session_id:	number, 
	player_id:	number, 
	json:		Type__Gnadenwurf, 
): Promise<undefined> {
	return api.patch(
		'/game/gnadenwurf', 
		json, 
		{ params: { 
			session_id, 
			player_id, 
		} }
	).then(({ data }) => data)
}
