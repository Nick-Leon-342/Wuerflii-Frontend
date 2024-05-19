

import { useLocation, useNavigate } from 'react-router-dom'





export default function useErrorHandling() {

	const navigate = useNavigate()
	const location = useLocation()





	const handle = ({ err, handle_404, handle_409 }) => {
		
		const status = err?.response?.status
		if(!err?.response) {
	
			window.alert('Server antwortet nicht!')
	
		} else {

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
					window.alert('Beim Server trat ein unerwarteter Fehler auf!')
					break

				default:
					console.log(err)
					window.alert(`Ein unbehandelter Fehler trat auf: ${status}`)
					break

			  }

		}

	}

	return handle

}
