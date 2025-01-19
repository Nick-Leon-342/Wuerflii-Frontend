

import './scss/Session_Players.scss'

import { v4 } from 'uuid'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import PopupError from '../../components/Popup/Popup_Error'
import CustomButton from '../../components/others/Custom_Button'
import OptionsDialog from '../../components/Popup/Popup_Options'
import Previous from '../../components/NavigationElements/Previous'
import DragAndDropNameColorList from '../../components/others/DragAndDropNameColorList'





export default function Session_Players() {

	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()
	const handle_error = useErrorHandling()

	const { session_id } = useParams()

	const [ user, setUser ] = useState()

	const [ error, setError ] = useState('')
	const [ loading_request, setLoading_request ] = useState(false)
	const [ loading, setLoading ] = useState(false)


	// ____________________ Players ____________________

	const [ MAX_PLAYERS, setMAX_PLAYERS ] = useState(0)
	const [ list_players, setList_players ] = useState([])
	const [ MAX_LENGTH_PLAYER_NAME, setMAX_LENGTH_PLAYER_NAME ] = useState(0)

	const new_player = () => { 
		return {
			id: v4(), 
			Name: `Spieler`, 
			Color: list_players.length % 2 === 0 ? '#ffffff' : '#ADD8E6'
		}
}





	useEffect(() => {

		setLoading_request(true)

		if(!session_id) return navigate(-1, { replace: true })

		axiosPrivate.get(`/session/players?session_id=${session_id}`).then(({ data }) => {

			const { 
				User, 
				MAX_PLAYERS, 
				List_Players, 
				MAX_LENGTH_PLAYER_NAME, 
			} = data

			setUser(User)

			setMAX_PLAYERS(MAX_PLAYERS)
			setMAX_LENGTH_PLAYER_NAME(MAX_LENGTH_PLAYER_NAME)
			setList_players(List_Players.length > 0 ? List_Players : [ new_player() ])

		}).catch(err => { 
			
			handle_error({ 
				err, 
			}) 
		
		}).finally(() => setLoading_request(false))

		// eslint-disable-next-line
	}, [])

	const add_player = () => {
		
		if(list_players.length === MAX_PLAYERS) return setError(`Es dürfen maximal nur ${MAX_PLAYERS} Spieler sein.`)

		setList_players(prev => {
			const list = [ ...prev ]
			list.push(new_player())
			return list
		})
		
	}

	const remove_player = () => {

		if(list_players.length === 1) {
			return setList_players(() => [{
				id: v4(), 
				Name: `Spieler`, 
				Color: '#ffffff', 
			}])
		}

		setList_players(prev => {
			const list = [ ...prev ]
			list.pop()
			return list
		})

	}

	const ok = () => {

		if(!list_players || list_players.some(p => p.Name.length > MAX_LENGTH_PLAYER_NAME)) return setError(`Die Spielernamen dürfen nicht länger als ${MAX_LENGTH_PLAYER_NAME} Zeichen sein.`)

		setLoading(true)

		axiosPrivate.post('/session/players', { 
			List_Players: list_players, 
			SessionID: +session_id, 
		}).then(() => {

			navigate(`/game?session_id=${session_id}`)
			
		}).catch((err) => {

			handle_error({ 
				err, 
				handle_404: () => {
					alert('Partie nicht gefunden.')
					navigate(-1, { replace: true })
				}
			})

		}).finally(() => setLoading(false))

	}





	return <>

		<OptionsDialog
			user={user}
			setUser={setUser}
		/>

		<PopupError
			error={error}
			setError={setError}
		/>



		<div className='session_players'>

			<Previous onClick={() => navigate(-1)}>
				<div className='session_players_previous-container'>
					<button 
						className='button button-responsive session_players_previous button-red-reverse'
						onClick={remove_player}
					><svg viewBox='0 -960 960 960'><path d='M640-520v-80h240v80H640Zm-280 40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z'/></svg></button>
					<button 
						className='button button-responsive session_players_previous button-reverse'
						onClick={add_player}
					><svg viewBox='0 -960 960 960'><path d='M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z'/></svg></button>
				</div>
			</Previous>



			<div className='session_players_list'>
				<DragAndDropNameColorList
					list_edit_players={list_players}
					setList_edit_players={setList_players}
					MAX_LENGTH_PLAYER_NAME={MAX_LENGTH_PLAYER_NAME}
				/>
			</div>



			<CustomButton 
				text='Los!'
				onClick={ok}
				loading={loading || loading_request}
			/>

		</div>

	</>
}
