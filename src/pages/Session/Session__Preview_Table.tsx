

import '../Game/scss/Game.scss'

import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useContext, useEffect } from 'react'

import Context__Universal_Loader from '../../Provider_And_Context/Provider_And_Context__Universal_Loader'
import useErrorHandling from '../../hooks/useErrorHandling'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import Table_Player from '../../components/Game/Game_Tables/Table_Player'
import OptionsDialog from '../../components/Popup/Popup__Options'
import Table from '../../components/Game/Game_Tables/Table'

import { get__session_players } from '../../api/session/session_players'
import { get__table_columns_archive } from '../../api/table_columns'
import { get__session } from '../../api/session/session'
import { get__user } from '../../api/user'





export default function Session__Preview_Table() {

	const { t } = useTranslation()
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

	const { data: session, isLoading: isLoading__session, error: error__session } = useQuery({
		queryFn: () => get__session(axiosPrivate, +(session_id || -1)), 
		queryKey: [ 'session', +(session_id || -1) ]
	})

	if(error__session) {
		handle_error({
			err: error__session, 
			handle_404: () => {
				alert(t('session_not_found'))
				navigate('/', { replace: true })
			}
		})
	}


	// ____________________ List__Players ____________________

	const { data: list_players, isLoading: isLoading__list_players, error: error__list_players } = useQuery({
		queryFn: () => get__session_players(axiosPrivate, +(session_id || -1)), 
		queryKey: [ 'session', +(session_id || -1), 'players' ], 
	})

	if(error__list_players) {
		handle_error({
			err: error__list_players, 
			handle_404: () => {
				alert(t('session_not_found'))
				navigate('/', { replace: true })
			}
		})
	}
		
	
	// ____________________ List__Table_Columns ____________________

	const { data: list__table_columns, isLoading: isLoading__list__table_columns, error: error__list__table_columns } = useQuery({
		queryFn: () => get__table_columns_archive(axiosPrivate, +(session_id || -1), +(finalscore_id || -1)), 
		queryKey: [ 'session', +(session_id || -1), +(finalscore_id || -1), 'table_columns' ], 
	})

	if(error__list__table_columns) {
		handle_error({
			err: error__list__table_columns, 
			handle_404: () => {
				alert(t('error.generic'))
				navigate(`/session/${session_id}/preview`, { replace: true })
			}
		})
	}





	useEffect(() => {

		if(!session_id) navigate('/', { replace: true })
		
		setTimeout(() => window.scrollTo({ top: 1500, left: 1250, behavior: 'smooth' }), 50)

	}, [ session ]) // eslint-disable-line

	// Loading animation
	useEffect(() => setLoading__universal_loader(isLoading__user || isLoading__session || isLoading__list_players || isLoading__list__table_columns), [ setLoading__universal_loader, isLoading__user, isLoading__session, isLoading__list_players, isLoading__list__table_columns ])





	return <>

		<OptionsDialog user={user}/>



		<div className='game-container'>
			<div className='game'>

				{!(isLoading__user || isLoading__session || isLoading__list_players || isLoading__list__table_columns) && session && list_players && list__table_columns && list__table_columns?.length !== 0 && <>

					<Table_Player 
						disabled={true}
						session={session}
						list_players={list_players}
						setList_players={() => {}}
						list__table_columns={list__table_columns}
					/>

					<Table 
						disabled={true}
						session={session}
						list_players={list_players}
						setList_table_columns={() => {}}
						list__table_columns={list__table_columns}
					/>

				</>}



				<button
					className='button'
					onClick={() => navigate(-1)}
				>{t('back')}</button>
				
			</div>
		</div>

	</>
}
