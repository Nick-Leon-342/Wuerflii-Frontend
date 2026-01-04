

export function get__analytics(axiosPrivate) {
	return axiosPrivate.get('/analytics').then(({ data }) => data)
}

export function get__analytics_session(axiosPrivate, session_id) {
	return axiosPrivate.get(`/analytics/session?session_id=${session_id}`).then(({ data }) => data)
}
