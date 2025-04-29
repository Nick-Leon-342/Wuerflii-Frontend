

import { useLocation, useNavigate } from 'react-router-dom'





export default function useRedirectToLogin() {

	const navigate = useNavigate()
	const location = useLocation()

	return () => navigate(`/login?next=${location.pathname}${location.search}`)
}
