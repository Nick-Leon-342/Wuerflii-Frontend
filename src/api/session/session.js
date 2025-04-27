

// __________________________________________________ Session __________________________________________________

export function get__session(axiosPrivate, session_id) {
	return axiosPrivate.get(`/session?session_id=${session_id}`).then(({ data }) => data)
}

export function post__session(axiosPrivate, json) {
	return axiosPrivate.post('/session', json).then(({ data }) => data)
}

export function patch__session(axiosPrivate, json) {
	return axiosPrivate.patch('/session', json).then(({ data }) => data)
}

export function delete__session(axiosPrivate, session_id) {
	return axiosPrivate.delete(`/session?session_id=${session_id}`).then(({ data }) => data)
}





// __________________________________________________ Session Env_Variables __________________________________________________

export function get__session_env_variables(axiosPrivate) {
	return axiosPrivate.get('/session/env').then(({ data }) => data)
}





// __________________________________________________ List of sessions __________________________________________________

export function get__sessions_list(axiosPrivate) {
	return axiosPrivate.get('/session/all').then(({ data }) => data)
}
