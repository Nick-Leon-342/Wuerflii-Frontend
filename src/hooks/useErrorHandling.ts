

import { format } from 'date-fns'
import { useLocation, useNavigate } from 'react-router-dom'

import useRedirectToLogin from './useRedirectToLogin'
import type { AxiosError } from 'axios';





interface Type__Use__Error_Handling {
    err:						AxiosError
    handle_no_server_response?:	() => void
    handle_401?:				() => void
    handle_403?:				() => void
    handle_404?:				() => void
    handle_409?:				() => void
    handle_500?:				() => void
    handle_default?:			() => void
}

/**
 * 
 * Custom hook for handling API errors based on the status codes.
 * This hook simplifies the process of responding to various HTTP error statuses by defining
 * specific behaviors for each status code.
 *
 * @returns {Function} handle - A function that processes an error response and handles it accordingly.
 *
 * @example
 * const handleError = useErrorHandling();
 * handleError({
 *   err: errorResponse, 
 *   handle_404: () => console.log('Resource not found'), 
 *   handle_409: () => console.log('Conflict occurred')
 * });
 * 
 */

export default function useErrorHandling() {

	const navigate = useNavigate()
	const location = useLocation()
	const redirect_to_login = useRedirectToLogin()





	return ({ 
		err, 
		handle_no_server_response, 

		handle_401, 
		handle_403, 
		handle_404, 
		handle_409, 

		handle_500, 
		
		handle_default, 
	}: Type__Use__Error_Handling) => {

		
		// Server doesn't respond
		if(!err?.response) {
	
			if(handle_no_server_response) return handle_no_server_response()
			console.error(format(new Date(), 'HH:mm.ss:'), err)
			return window.alert('Server antwortet nicht!')
	
		} 


		// Redirect to login if user wasn't found
		if(err?.response?.data === 'User not found.') return redirect_to_login()


		// Check status
		const status = err?.response?.status
		switch (status) {
			case 400:
				window.alert(`Clientanfrage fehlerhaft!\n${err.response.data}`)
				break

			case 401:
				if(handle_401) return handle_401()
				navigate(`/?next=${location.pathname}${location.search}`, { replace: true })
				break

			case 403:
				if(handle_403) return handle_403()
				navigate(`/?next=${location.pathname}${location.search}`, { replace: true })
				break

			case 404:
				if(handle_404) {
					handle_404()
				} else {
					alert(err.response.data)
				}
				break

			case 409:
				if(handle_409) {
					handle_409()
				} else {
					alert(err.response.data)
				}
				break

			case 500:
				if(handle_500) {
					handle_500()
				} else {
					window.alert('Beim Server trat ein unerwarteter Fehler auf!')
				}
				break

			default:
				if(handle_default) {
					handle_default()
				} else {
					console.error(err)
					window.alert(`Ein unbehandelter Fehler trat auf: ${status}`)
				}
				break
		}

	}

}
