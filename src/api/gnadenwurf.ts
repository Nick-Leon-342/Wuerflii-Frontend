

import type { Axios } from 'axios'

import type { Type__Client_To_Server__Gnadenwurf__PATCH } from '../types/Type__Client_To_Server/Type__Client_To_Server__Gnadenwurf__PATCH'





export async function patch__gnadenwurf(
	api:	Axios, 
	json:	Type__Client_To_Server__Gnadenwurf__PATCH, 
): Promise<undefined> {
	return api.patch('/game/gnadenwurf', json).then(({ data }) => data)
}
