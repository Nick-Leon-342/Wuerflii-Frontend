

export function get__session_players(axiosPrivate, session_id) {
	return axiosPrivate.get(`/session/players?session_id=${session_id}`).then(({ data }) => data)
}

export function post__session_players(axiosPrivate, json) {
	return axiosPrivate.post('/session/players', json).then(({ data }) => data)
}

export function patch__session_players(axiosPrivate, json) {
	return axiosPrivate.patch('/session/players', json).then(({ data }) => data)
}
