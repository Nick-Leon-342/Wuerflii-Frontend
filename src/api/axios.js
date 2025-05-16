

import axios from 'axios'

export const axiosDefault = axios.create({})


export const axiosPrivate = axios.create({
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true
})
