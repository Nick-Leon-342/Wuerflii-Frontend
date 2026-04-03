

import axios from 'axios'

import { VITE_BACKEND_URL } from '../logic/utils'





export const api = axios.create({ 
	baseURL: VITE_BACKEND_URL, 
	withCredentials: true, 
})

