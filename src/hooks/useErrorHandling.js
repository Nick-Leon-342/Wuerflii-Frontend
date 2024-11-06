

import { useLocation, useNavigate } from 'react-router-dom'





export default function useErrorHandling() {

	const navigate = useNavigate()
	const location = useLocation()





	return ({ 
		err, 
		handle_no_server_response, 
		handle_404, 
		handle_409, 
		handle_500, 
		handle_default 
	}) => {

		
		const status = err?.response?.status
		if(!err?.response) {
	
			if(handle_no_server_response) {
				handle_no_server_response()
			} else {
				window.alert('Server antwortet nicht!')
			}
			return
	
		} 

		switch (status) {
			case 400:
				window.alert('Clientanfrage fehlerhaft!')
				break

			case 401:
			case 403:
				navigate(`/?next=${location.pathname}${location.search}`, { replace: true })
				break

			case 404:
				handle_404()
				break

			case 409:
				handle_409()
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
					console.log(err)
					window.alert(`Ein unbehandelter Fehler trat auf: ${status}`)
				}
				break
		}


	}

}
