

import { useLocation, useNavigate } from 'react-router-dom'





export default function useRedirectToLogin() {

	const navigate = useNavigate()
	const location = useLocation()

	return () => navigate(`/registration_and_login?next=${location.pathname}${location.search}`)
}
