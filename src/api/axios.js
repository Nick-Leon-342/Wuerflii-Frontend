

import axios from 'axios'

import { REACT_APP_BACKEND_URL } from '../logic/utils'





export const axiosDefault = axios.create({ 
	baseURL: REACT_APP_BACKEND_URL
})

export const axiosPrivate = axios.create({
	headers: { 'Content-Type': 'application/json' },
	baseURL: REACT_APP_BACKEND_URL, 
	withCredentials: true, 
})
