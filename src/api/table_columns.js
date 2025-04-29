

export function get__table_columns(axiosPrivate, session_id) {
	return axiosPrivate.get(`/game/table_columns?session_id=${session_id}`).then(({ data }) => data)
}

export function patch__table_columns(axiosPrivate, json) {
	return axiosPrivate.patch('/game/table_columns', json).then(({ data }) => data)
}
