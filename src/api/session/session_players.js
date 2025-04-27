

export function get__session_players(axiosPrivate, session_id) {
	return axiosPrivate.get(`/session/players?session_id=${session_id}`).then(({ data }) => data)
}
