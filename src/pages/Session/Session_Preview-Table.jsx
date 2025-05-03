

import '../Game/scss/Game.scss'

import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Loader from '../../components/Loader/Loader'
import Table from '../../components/Game/Game_Tables/Table'
import OptionsDialog from '../../components/Popup/Popup_Options'
import TablePlayer from '../../components/Game/Game_Tables/Table_Player'

import { get__user } from '../../api/user'
import { get__session } from '../../api/session/session'
import { get__session_players } from '../../api/session/session_players'
import { get__table_columns_archive } from '../../api/table_columns'





export default function Session_Preview_Table() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()	// TODO implement error handling

	const { session_id, finalscore_id } = useParams()


	// __________________________________________________ Queries __________________________________________________

	// ____________________ User ____________________

	const { data: user, isLoading: isLoading__user, error: error__user } = useQuery({
		queryFn: () => get__user(axiosPrivate), 
		queryKey: [ 'user' ], 
	})


	// ____________________ Session ____________________

	const { data: session, isLoading__session, error: error__session } = useQuery({
		queryFn: () => get__session(axiosPrivate, session_id), 
		queryKey: [ 'session', +session_id ]
	})


	// ____________________ List_Players ____________________

	const { data: list_players, isLoading: isLoading__list_players, error: error__list_players } = useQuery({
		queryFn: () => get__session_players(axiosPrivate, session_id), 
		queryKey: [ 'session', +session_id, 'players' ], 
	})
		
	
	// ____________________ List_Table_Columns ____________________

	const { data: list_table_columns, isLoading: isLoading__list_table_columns, isError: isError__list_table_columns } = useQuery({
		queryFn: () => get__table_columns_archive(axiosPrivate, session_id, finalscore_id), 
		queryKey: [ 'session', +session_id, 'table_columns' ], 
	})





	useEffect(() => {

		if(!session_id) return navigate('/', { replace: true })
		
		setTimeout(() => window.scrollTo({ top: 1500, left: 1250, behavior: 'smooth' }), 50)

		// eslint-disable-next-line
	}, [ session ])





	return <>

		<OptionsDialog user={user}/>



		<div className='game-container'>
			<div className='game'>

				<Loader loading={isLoading__user || isLoading__session || isLoading__list_players || isLoading__list_table_columns}/>

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

				<button
					className='button'
					onClick={() => navigate(-1)}
				>Zurück</button>
				
			</div>
		</div>

	</>
}
