

export function get__table_columns(axiosPrivate, session_id) {
	return axiosPrivate.get(`/game/table_columns?session_id=${session_id}`).then(({ data }) => data)
}

export function patch__table_columns(axiosPrivate, json) {
	return axiosPrivate.patch('/game/table_columns', json).then(({ data }) => data)
}





export function get__table_columns_archive(axiosPrivate, session_id, finalscore_id) {
	return axiosPrivate.get(`/game/table_columns/archive?session_id=${session_id}&finalscore_id=${finalscore_id}`).then(({ data }) => data)
}
