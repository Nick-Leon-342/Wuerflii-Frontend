

import type { Axios } from 'axios'
import type { Type__Client_To_Server__Player__PATCH } from '../types/Type__Client_To_Server/Type__Client_To_Server__Player__PATCH'





export async function patch__player(
	axiosPrivate:	Axios, 
	json:			Type__Client_To_Server__Player__PATCH, 
): Promise<undefined> {
	return axiosPrivate.patch('/player', json).then(({ data }) => data)
}
