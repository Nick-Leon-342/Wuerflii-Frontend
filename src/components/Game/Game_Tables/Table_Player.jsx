

import './scss/Table_Player.scss'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import useErrorHandling from '../../../hooks/useErrorHandling'

import LoaderBox from '../../Loader/Loader_Box'





export default function Table_Player({ 
	setList_players, 
	list_players, 
	disabled, 
	session, 
}) {

	const calculateScore = ( player ) => {

		let sum = 0
		for(const tc of player.List_Table_Columns) { sum += tc.TotalScore }
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

					{list_players?.map((p, i) => 
						<div className='table_player_column' key={i}>
							<span>{calculateScore(p)}</span>
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
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ loading, setLoading ] = useState(false)





	const change = async () => {

		const bool = !list_players[index_player].Gnadenwurf_Used
		
		for(let i = 0; 100 > i; i++) {
			
			let try_again = false
			setLoading(true)
	
			await axiosPrivate.patch(`/player`, {
				SessionID: session.id, 
				PlayerID: list_players[index_player].id, 
				Gnadenwurf_Used: bool
			}).then(() => {
	
				setList_players(prev => {
					const tmp = [ ...prev ]
					tmp[index_player].Gnadenwurf_Used = bool
					return tmp
				})
	
			}).catch(err => {
	
				handle_error({
					err, 
					handle_no_server_response: () => {
						if(window.confirm(`Der Server antwortet nicht.\nDer Gnadenwurf für '${list_players[index_player].Name}' wurde nicht synchronisiert.\nErneut versuchen?`)) try_again = true
					}, 
					handle_404: () => {
						alert('Benutzer, Session oder Spieler wurde nicht gefunden!')
						navigate(`/game/create`)
					}, 
					handle_500: () => {
						if(window.confirm(`Beim Server ist ein Fehler aufgetreten.\nDer Gnadenwurf für '${list_players[index_player].Name}' wurde nicht synchronisiert.\nErneut versuchen?`)) try_again = true
					}
				})
	
			}).finally(() => setLoading(false))


			if(!try_again) return

		}

	}





	return <>
		{loading &&
			<div className='table_player_loader-container'>
				<LoaderBox
					className='table_player_loader'
					dark={true}
				/>
			</div>
		}

		{!loading &&
			<input 
				className='button-responsive' 
				type='checkbox' 
				checked={list_players[index_player].Gnadenwurf_Used}
				onChange={change} 
			/>
		}
	</>
}
