

export function patch__player(axiosPrivate, json) {
	return axiosPrivate.patch('/player', json).then(({ data }) => data)
}
