

import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { toast } from 'sonner'

import type { AxiosError } from 'axios'

import axios from 'axios'





interface Type__Use__Error_Handling {
    err:						AxiosError | Error
    handle_no_server_response?:	() => void
    handle_400?:				() => void
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

	const { t }				= useTranslation()





	return ({ 
		err, 
		handle_no_server_response, 

		handle_400, 
		handle_401, 
		handle_404, 
		handle_409, 

		handle_500, 
		
		handle_default, 
	}: Type__Use__Error_Handling) => {
		
		if(!axios.isAxiosError(err)) {
			if(handle_default) return handle_default()
			console.error(format(new Date(), 'dd.MM.yyyy - HH:mm.ss:'), err)
			return toast.error(`${t('error.unhandled_error')} ${err?.message || ''}`)
		}

		// Server doesn't respond
		if(!err?.response) {
	
			if(handle_no_server_response) return handle_no_server_response()
			console.error(format(new Date(), 'dd.MM.yyyy - HH:mm.ss:'), err)
			return toast.error(t('error.server_is_not_responding'))
	
		} 


		// Check status
		const status = err?.response?.status
		switch (status) {
			case 400:
				if(handle_400) return handle_400()
				toast.error(`${t('error.client_request_invalid')}\n${err.response.data}`)
				break

			case 401:
				if(handle_401) return handle_401()
				break

			case 404:
				if(handle_404) {
					handle_404()
				} else {
					toast.error(err.response.data)
				}
				break

			case 409:
				if(handle_409) {
					handle_409()
				} else {
					toast.error(err.response.data)
				}
				break

			case 500:
				if(handle_500) {
					handle_500()
				} else {
					toast.error(t('error.server_is_not_responding'))
				}
				break

			default:
				if(handle_default) {
					handle_default()
				} else {
					console.error(err)
					toast.error(`${t('error.unhandled_error')} ${status}`)
				}
				break
		}

	}

}
