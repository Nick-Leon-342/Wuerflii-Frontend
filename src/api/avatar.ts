

import { api } from './axios'


export async function get__avatar() {
	return api.get(
		'/avatar', 
		{ responseType: 'blob' }
	)
}

export async function post__avatar(
	json: FormData
): Promise<string> {
	return api.post(
		'/avatar', 
		json
	).then(({ data }) => data)
}
