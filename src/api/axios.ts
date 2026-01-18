

import axios from 'axios'

import { VITE_BACKEND_URL } from '../logic/utils'





export const axiosDefault = axios.create({ 
	baseURL: VITE_BACKEND_URL
})

export const axiosPrivate = axios.create({
	headers: { 'Content-Type': 'application/json' },
	baseURL: VITE_BACKEND_URL, 
	withCredentials: true, 
})
