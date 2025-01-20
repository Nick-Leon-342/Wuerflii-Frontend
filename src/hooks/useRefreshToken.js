

import axios from '../api/axios'
import useAuth from './useAuth'





export default function useRefreshToken() {
	
    const { setAuth } = useAuth()

    return async () => {
        const response = await axios.get('/refreshtoken', {
            withCredentials: true
        })
        setAuth(prev => {
            return { ...prev, accessToken: response.data.accessToken }
        })
        return response.data.accessToken
    }

}
