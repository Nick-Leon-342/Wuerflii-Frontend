

import '../Game/scss/Game.scss'

import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Loader from '../../components/Loader/Loader'
import Table from '../../components/Game/Game_Tables/Table'
import OptionsDialog from '../../components/Popup/Popup_Options'
import TablePlayer from '../../components/Game/Game_Tables/Table_Player'





export default function Game() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()


	const location = useLocation()
	
	const [ user, setUser ] = useState()
	const [ session, setSession ] = useState()
	const [ list_players, setList_players ] = useState()

	const [ loading_request, setLoading_request ] = useState(false)





	useEffect(() => {

		const url_params = new URLSearchParams(location.search)
		const session_id = url_params.get('session_id')
		const finalscore_id = url_params.get('finalscore_id')

		if(!session_id || !finalscore_id) return navigate(`/session/preview?session_id=${session_id}`, { replace: true })

		setLoading_request(true)

		axiosPrivate.get(`/session/preview/table?session_id=${session_id}&finalscore_id=${finalscore_id}`).then(({ data }) => {
			
			
			setUser(data.User)
			setList_players(data.List_Players)
			setSession(data.Session)

			setTimeout(() => window.scrollTo({ top: 1500, left: 1250, behavior: 'smooth' }), 50)


		}).catch((err) => {

			handle_error({
				err, 
				handle_404: () => {
					window.alert('Die Session oder die Tabelle wurde nicht gefunden!')
					navigate(`/session/preview?session_id=${session_id}`, { replace: true })
				},
			})
			
		}).finally(() => setLoading_request(false))

		

		// eslint-disable-next-line
	}, [])


	





	if(loading_request) return <Loader loading={true}/>

	return (<>

		<OptionsDialog
			user={user}
			setUser={setUser}
		/>



		<div className='game_container'>
			<div className='game'>

				<TablePlayer 
					disabled={true}
					session={session}
					list_players={list_players}
					setList_players={setList_players}
				/>

				<Table 
					disabled={true}
					session={session}
					list_players={list_players}
					setList_players={setList_players}
				/>

				<button
					className='button'
					onClick={() => navigate(-1)}
				>Zurück</button>
				
			</div>
		</div>

	</>)
}
