

import type { Axios } from 'axios'
import type { Type__Client_To_Server__Session_Players__Post } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session_Players__POST_And_PATCH'





export function get__session_players(
	axiosPrivate:	Axios, 
	session_id:		number,
) {
	return axiosPrivate.get(`/session/players?session_id=${session_id}`).then(({ data }) => data)
}

export function post__session_players(
	axiosPrivate:	Axios, 
	json:			Type__Client_To_Server__Session_Players__Post, 
) {
	return axiosPrivate.post('/session/players', json).then(({ data }) => data)
}

export function patch__session_players(
	axiosPrivate:	Axios, 
	json:			Type__Client_To_Server__Session_Players__Post, 
) {
	return axiosPrivate.patch('/session/players', json).then(({ data }) => data)
}
