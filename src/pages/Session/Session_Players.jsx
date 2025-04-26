

import './scss/Session_Players.scss'

import { v4 } from 'uuid'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import CustomButton from '../../components/others/Custom_Button'
import OptionsDialog from '../../components/Popup/Popup_Options'
import Previous from '../../components/NavigationElements/Previous'
import DragAndDropNameColorList from '../../components/others/DragAndDropNameColorList'

import { ReactComponent as PersonAdd } from '../../svg/Person_Add.svg'
import { ReactComponent as PersonRemove } from '../../svg/Person_Remove.svg'





export default function Session_Players({
	setError, 
}) {

	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()
	const handle_error = useErrorHandling()

	const { session_id } = useParams()

	const [ user, setUser ] = useState()

	const [ loading_request, setLoading_request ] = useState(false)
	const [ loading, setLoading ] = useState(false)


	// ____________________ Players ____________________

	const [ isInit, setIsInit ] = useState(false)
	const [ MAX_PLAYERS, setMAX_PLAYERS ] = useState(0)
	const [ list_players, setList_players ] = useState([])
	const [ MAX_LENGTH_PLAYER_NAME, setMAX_LENGTH_PLAYER_NAME ] = useState(0)





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

			setIsInit(List_Players.length === 0)
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

	const new_player = () => { 
		return {
			id: v4(), 
			Name: `Spieler`, 
			Color: list_players.length % 2 === 0 ? '#ffffff' : '#ADD8E6'
		}
	}

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

	const ok = async () => {

		if(!list_players || list_players.some(p => p.Name.length > MAX_LENGTH_PLAYER_NAME)) return setError(`Die Spielernamen dürfen nicht länger als ${MAX_LENGTH_PLAYER_NAME} Zeichen sein.`)

		setLoading(true)


		const url = '/session/players'
		const json = { 
			List_Players: list_players, 
			SessionID: +session_id, 
		}


		try {

			if(isInit) {
				await axiosPrivate.post(url, json)
				navigate(`/game?session_id=${session_id}`, { replace: true })
			} else {
				await axiosPrivate.patch(url, json)
				navigate(-1, { replace: false })
			}

		} catch(err) {

			handle_error({ 
				err, 
				handle_404: () => {
					alert('Partie nicht gefunden.')
					navigate(-1, { replace: true })
				}
			})

		}

		setLoading(false)

	}





	return <>

		<OptionsDialog
			user={user}
			setUser={setUser}
		/>



		<div className='session_players'>

			<Previous onClick={() => navigate(-1)}>
				{isInit && <>
					<div className='session_players_previous-container'>
						<button 
							className='button button-responsive session_players_previous button-red-reverse'
							onClick={remove_player}
						><PersonRemove/></button>
						<button 
							className='button button-responsive session_players_previous button-reverse'
							onClick={add_player}
						><PersonAdd/></button>
					</div>
				</>}
			</Previous>



			<div className='session_players_list'>
				<DragAndDropNameColorList
					list_edit_players={list_players}
					setList_edit_players={setList_players}
					MAX_LENGTH_PLAYER_NAME={MAX_LENGTH_PLAYER_NAME}
				/>
			</div>



			<CustomButton 
				text={isInit ? 'Los!' : 'Speichern'}
				onClick={ok}
				loading={loading || loading_request}
			/>

		</div>

	</>
}
