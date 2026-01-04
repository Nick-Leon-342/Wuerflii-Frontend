

import './scss/Table_Player.scss'

import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useErrorHandling from '../../../hooks/useErrorHandling'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import LoaderBox from '../../Loader/Loader_Box'

import { patch__player } from '../../../api/player'





/**
 * 
 * Table_Player component that displays the list of players, their scores, and allows toggling of the "Gnadenwurf" (grace throw) option.
 * 
 * @component
 * @example
 * // Example usage of Table_Player component
 * <Table_Player 
 *   list_table_columns={listTableColumns} 
 *   list_players={listPlayers} 
 *   disabled={false} 
 *   session={session} 
 * />
 *
 * @param {Object} props - The component props
 * @param {Array} props.list_table_columns - List of columns for each players to calculate current score
 * @param {Array} props.setList_players - Function to edit list of players
 * @param {Array} props.list_players - List of players to display
 * @param {boolean} props.disabled - Boolean to control whether the grace throw option is disabled
 * @param {Object} props.session - The current session object containing session details like "ShowScores"
 *
 * @returns {JSX.Element} The rendered Table_Player component
 * 
 */

export default function Table_Player({ 
	list_table_columns, 
	setList_players, 
	list_players, 
	disabled, 
	session, 
}) {

	const calculateScore = index_player => {

		if(!list_table_columns) return 

		let sum = 0
		for(const tc of list_table_columns[index_player].List_Table_Columns) { sum += tc.TotalScore }
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

			{session?.ShowScores && <>
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

			{!disabled && <>
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





const Gnadenwurf = ({
	setList_players, 
	list_players, 
	index_player, 
	session, 
}) => {

	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const mutate__gnadenwurf = useMutation({
		mutationFn: json => patch__player(axiosPrivate, json), 
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
