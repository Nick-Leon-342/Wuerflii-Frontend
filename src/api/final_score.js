

export function get__final_score(axiosPrivate, session_id, final_score_id) {
	return axiosPrivate.get(`/finalscore?session_id=${session_id}&finalscore_id=${final_score_id}`).then(({ data }) => data)
}
