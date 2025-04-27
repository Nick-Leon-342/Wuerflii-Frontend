

export function get__user(axiosPrivate) {
	return axiosPrivate.get('/user').then(({ data }) => data)
}

export function patch__user(axiosPrivate, json) {
	return axiosPrivate.patch('/user', json).then(({ data }) => data)
}
