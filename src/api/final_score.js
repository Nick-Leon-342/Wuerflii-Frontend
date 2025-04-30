

export function get__final_score(axiosPrivate, session_id, final_score_id) {
	return axiosPrivate.get(`/finalscore?session_id=${session_id}&finalscore_id=${final_score_id}`).then(({ data }) => data)
}

export function get__final_scores_page(axiosPrivate, session_id, page) {
	return axiosPrivate.get(
		`/finalscore/all?session_id=${session_id}&offset_block=${page}`
	).then(({ data }) => {
		return {
			nextPage: data.Has_More ? page + 1 : undefined, 
			currentPage: page,
			list_finalscores: data.List,
		}
	})
}
