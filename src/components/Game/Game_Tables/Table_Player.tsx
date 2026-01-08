

import './scss/Table_Player.scss'

import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useErrorHandling from '../../../hooks/useErrorHandling'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import LoaderBox from '../../Loader/Loader_Box'

import { patch__player } from '../../../api/player'
import type { Type__Server_Response__Table_Columns__Get } from '../../../types/Type__Server_Response/Type__Server_Response__Table_Columns__GET'
import type { Type__Server_Reponse__Player__Get } from '../../../types/Type__Server_Response/Type__Server_Response__Player__GET'
import type { Type__Session } from '../../../types/Type__Session'
import type { Type__Client_To_Server__Player__PATCH } from '../../../types/Type__Client_To_Server/Type__Client_To_Server__Player__PATCH'





interface Props__Table_Player {
	list_table_columns:	Array<Type__Server_Response__Table_Columns__Get>
	setList_players:	React.Dispatch<React.SetStateAction<Array<Type__Server_Reponse__Player__Get>>>
	list_players:		Array<Type__Server_Reponse__Player__Get>
	disabled:			boolean
	session:			Type__Session | undefined
}

export default function Table_Player({ 
	list_table_columns, 
	setList_players, 
	list_players, 
	disabled, 
	session, 
}: Props__Table_Player) {

	function calculateScore(index_player: number): number {

		if(!list_table_columns) return 0

		let sum = 0
		for(const tc of list_table_columns[index_player].List__Table_Columns) { sum += tc.TotalScore }
		return sum

	}





	return <>

		<div className='table_player'>

			{/* __________________________________________________ Names __________________________________________________ */}

			<div className='table_player_row'>

				<div className='table_player_column'><span>Spieler</span></div>

				{list_players?.map((player, index_player) => 
					<div className='table_player_column' key={index_player}>
						<span>{player.Name}</span>
					</div>
				)}

			</div>



			{/* __________________________________________________ Scores __________________________________________________ */}

			{session?.Scores_Visible && <>
				<div className='table_player_row'>

					<div className='table_player_column'><span>Spieler gesamt</span></div>

					{list_players?.map((_, index_player) => 
						<div className='table_player_column' key={index_player}>
							<span>{calculateScore(index_player)}</span>
						</div>
					)}

				</div>
			</>}



			{/* __________________________________________________ Gnadenwurf __________________________________________________ */}

			{session && !disabled && <>
				<div className='table_player_row'>

					<div className='table_player_column'><span>Gnadenwurf</span></div>

					{list_players?.map((_, index_player) => 
						<div className='table_player_column' key={index_player}>
							<div className='checkbox-container'>
								
								<Gnadenwurf
									setList_players={setList_players}
									list_players={list_players}
									index_player={index_player}
									session={session}
								/>

							</div>
						</div>
					)}

				</div>
			</>}
		</div>
	</>
}





interface Props__Gnadenwurf {
	setList_players:	React.Dispatch<React.SetStateAction<Array<Type__Server_Reponse__Player__Get>>>
	list_players:		Array<Type__Server_Reponse__Player__Get>
	index_player:		number
	session:			Type__Session
}

const Gnadenwurf = ({
	setList_players, 
	list_players, 
	index_player, 
	session, 
}: Props__Gnadenwurf) => {

	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const mutate__gnadenwurf = useMutation({
		mutationFn: (json: Type__Client_To_Server__Player__PATCH) => patch__player(axiosPrivate, json), 
		onSuccess: (_, json) => {
			setList_players(prev => {
				const tmp = [ ...prev ]
				tmp[index_player].Gnadenwurf_Used = json.Gnadenwurf_Used
				query_client.setQueryData([ 'session', session.id, 'players' ], tmp)
				return tmp 
			})
		}, 
		onError: (err, json) => {
			handle_error({
				err, 
				handle_no_server_response: () => {
					if(window.confirm(`Der Server antwortet nicht.\nDer Gnadenwurf für '${list_players[index_player].Name}' wurde nicht synchronisiert.\nErneut versuchen?`)) mutate__gnadenwurf.mutate(json)
				}, 
				handle_404: () => {
					alert('Die Ressource wurde nicht gefunden!')
					navigate(`/`)
				}, 
				handle_500: () => {
					if(window.confirm(`Beim Server ist ein Fehler aufgetreten.\nDer Gnadenwurf für '${list_players[index_player].Name}' wurde nicht synchronisiert.\nErneut versuchen?`)) mutate__gnadenwurf.mutate(json)
				}
			})
		}
	})





	const change = async () => {

		const bool = !list_players[index_player].Gnadenwurf_Used

		mutate__gnadenwurf.mutate({
			SessionID: session.id, 
			PlayerID: list_players[index_player].id, 
			Gnadenwurf_Used: bool
		})

	}





	return <>
		{mutate__gnadenwurf.isPending &&
			<div className='table_player_loader-container'>
				<LoaderBox
					className='table_player_loader'
					dark={true}
				/>
			</div>
		}

		{!mutate__gnadenwurf.isPending &&
			<input 
				type='checkbox' 
				onChange={change} 
				className='button-responsive' 
				checked={list_players[index_player].Gnadenwurf_Used}
			/>
		}
	</>
}
