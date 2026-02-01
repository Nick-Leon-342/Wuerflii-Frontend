

import { axiosDefault } from '../api/axios'
import useAuth from './useAuth'





export default function useRefreshToken() {
	
    const { setAuth } = useAuth()

    return async () => {
        const response = await axiosDefault.get('/refreshtoken', {
            withCredentials: true
        })
        setAuth(prev => {
            return { ...prev, access_token: response.data.access_token }
        })
        return response.data.access_token
    }

}
