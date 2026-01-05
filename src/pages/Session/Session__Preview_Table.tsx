

import '../Game/scss/Game.scss'

import { useContext, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'
import Context__Universal_Loader from '../../Provider_And_Context/Provider_And_Context__Universal_Loader'

import Table from '../../components/Game/Game_Tables/Table'
import OptionsDialog from '../../components/Popup/Popup_Options'
import TablePlayer from '../../components/Game/Game_Tables/Table_Player'

import { get__user } from '../../api/user'
import { get__session } from '../../api/session/session'
import { get__table_columns_archive } from '../../api/table_columns'
import { get__session_players } from '../../api/session/session_players'





export default function Session__Preview_Table() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()
	
	const { session_id, finalscore_id } = useParams()

	const { setLoading__universal_loader } = useContext(Context__Universal_Loader)


	// __________________________________________________ Queries __________________________________________________

	// ____________________ User ____________________

	const { data: user, isLoading: isLoading__user, error: error__user } = useQuery({
		queryFn: () => get__user(axiosPrivate), 
		queryKey: [ 'user' ], 
	})

	if(error__user) {
		handle_error({
			err: error__user, 
		})
	}


	// ____________________ Session ____________________

	const { data: session, isLoading__session, error: error__session } = useQuery({
		queryFn: () => get__session(axiosPrivate, session_id), 
		queryKey: [ 'session', +session_id ]
	})

	if(error__session) {
		handle_error({
			err: error__session, 
			handle_404: () => {
				alert('Die Partie wurde nicht gefunden.')
				navigate('/', { replace: true })
			}
		})
	}


	// ____________________ List_Players ____________________

	const { data: list_players, isLoading: isLoading__list_players, error: error__list_players } = useQuery({
		queryFn: () => get__session_players(axiosPrivate, session_id), 
		queryKey: [ 'session', +session_id, 'players' ], 
	})

	if(error__list_players) {
		handle_error({
			err: error__list_players, 
			handle_404: () => {
				alert('Die Partie wurde nicht gefunden.')
				navigate('/', { replace: true })
			}
		})
	}
		
	
	// ____________________ List_Table_Columns ____________________

	const { data: list_table_columns, isLoading: isLoading__list_table_columns, error: error__list_table_columns } = useQuery({
		queryFn: () => get__table_columns_archive(axiosPrivate, session_id, finalscore_id), 
		queryKey: [ 'session', +session_id, +finalscore_id, 'table_columns' ], 
	})

	if(error__list_table_columns) {
		handle_error({
			err: error__list_table_columns, 
			handle_404: () => {
				alert('Eine Ressource wurde nicht gefunden.')
				navigate(`/session/${session_id}/preview`, { replace: true })
			}
		})
	}





	useEffect(() => {

		if(!session_id) return navigate('/', { replace: true })
		
		setTimeout(() => window.scrollTo({ top: 1500, left: 1250, behavior: 'smooth' }), 50)

		// eslint-disable-next-line
	}, [ session ])

	// Loading animation
	useEffect(() => setLoading__universal_loader(isLoading__user || isLoading__session || isLoading__list_players || isLoading__list_table_columns), [ setLoading__universal_loader, isLoading__user, isLoading__session, isLoading__list_players, isLoading__list_table_columns ])





	return <>

		<OptionsDialog user={user}/>



		<div className='game-container'>
			<div className='game'>

				{!(isLoading__user || isLoading__session || isLoading__list_players || isLoading__list_table_columns) && <>

					<TablePlayer 
						disabled={true}
						session={session}
						list_players={list_players}
						list_table_columns={list_table_columns}
					/>

					<Table 
						disabled={true}
						session={session}
						list_players={list_players}
						list_table_columns={list_table_columns}
					/>

				</>}



				<button
					className='button'
					onClick={() => navigate(-1)}
				>Zurück</button>
				
			</div>
		</div>

	</>
}
