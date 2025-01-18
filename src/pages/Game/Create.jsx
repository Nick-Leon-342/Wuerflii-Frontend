

import './scss/Create.scss'

import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import FancyInput from '../../components/others/FancyInput'
import PopupError from '../../components/Popup/Popup_Error'
import CustomButton from '../../components/others/Custom_Button'
import OptionsDialog from '../../components/Popup/Popup_Options'
import Previous from '../../components/NavigationElements/Previous'
import CustomLink from '../../components/NavigationElements/CustomLink'
import DragAndDropNameColorList from '../../components/others/DragAndDropNameColorList'
import { v4 } from 'uuid'





export default function Create() {

	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()
	const handle_error = useErrorHandling()

	const [ user, setUser ] = useState()
	const [ loading_request, setLoading_request ] = useState(false)

	const [ error, setError ] = useState('')
	const [ show_enterNames, setShow_enterNames ] = useState(false)





	useEffect(() => {

		setLoading_request(true)

		axiosPrivate.get('/game/create').then(({ data }) => {

			const { 
				User, 
				MAX_PLAYERS, 
				MAX_COLUMNS, 
				MAX_LENGTH_PLAYER_NAME, 
				MAX_LENGTH_SESSION_NAME, 
			} = data

			setUser(User)

			setMAX_LENGTH_SESSION_NAME(MAX_LENGTH_SESSION_NAME)
			setMAX_COLUMNS(MAX_COLUMNS)
			setOptions_columns(Array.from({ length: MAX_COLUMNS }, (_, index) => index + 1))

			setMAX_LENGTH_PLAYER_NAME(MAX_LENGTH_PLAYER_NAME)
			setMAX_PLAYERS(MAX_PLAYERS)
			setOptions_players(Array.from({ length: MAX_PLAYERS }, (_, index) => index + 1))

		}).catch(err => { 
			
			handle_error({ err }) 
		
		}).finally(() => setLoading_request(false))

		// eslint-disable-next-line
	}, [])





	// __________________________________________________ Session __________________________________________________

	const [ name, setName ] = useState('Partie')
	const [ color, setColor ] = useState('#00FF00')
	const [ MAX_LENGTH_SESSION_NAME, setMAX_LENGTH_SESSION_NAME ] = useState(0)

	const [ columns, setColumns ] = useState('')
	const [ options_columns, setOptions_columns ] = useState([])
	const [ MAX_COLUMNS, setMAX_COLUMNS ] = useState(0)





	// __________________________________________________ Players __________________________________________________

	const [ players, setPlayers ] = useState('')
	const [ options_players, setOptions_players ] = useState([])
	const [ MAX_PLAYERS, setMAX_PLAYERS ] = useState(0)
	const [ list_players, setList_players ] = useState([])
	const [ MAX_LENGTH_PLAYER_NAME, setMAX_LENGTH_PLAYER_NAME ] = useState(0)

	const add_player = () => {
		
		if(list_players.length === MAX_PLAYERS) return setError(`Es dürfen maximal nur ${MAX_PLAYERS} Spieler sein.`)

		setList_players(prev => {
			const list = [ ...prev ]
			list.push({
				id: v4(), 
				Name: `Spieler`, 
				Color: list.length % 2 === 0 ? '#ffffff' : '#ADD8E6'
			})
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








	// __________________________________________________ EnterNames __________________________________________________

	const [ loading_play, setLoading_play ] = useState(false)

	const next = () => {
		
		setError('')
		if(!name) return setError('Bitte einen Namen für die Parte eingeben.')
		if(name.length > MAX_LENGTH_SESSION_NAME) return setError(`Der Name der Partie darf nicht länger als ${MAX_LENGTH_SESSION_NAME} Zeichen sein.`)
		if(!columns) return setError('Bitte die Spaltenanzahl angeben.')

		setShow_enterNames(true)

		setList_players(() => [{
			id: 0, 
			Name: `Spieler`, 
			Color: '#ffffff', 
		}])

	}

	const play = () => {

		if(!list_players || list_players.some(p => p.Name.length > MAX_LENGTH_PLAYER_NAME)) return setError(`Die Spielernamen dürfen nicht länger als ${MAX_LENGTH_PLAYER_NAME} Zeichen sein.`)

		setLoading_play(true)

		axiosPrivate.post('/game/create', {
			Name: name, 
			Color: color, 
			Columns: +columns, 
			List_Players: list_players,
		}).then(({ data }) => {

			navigate(`/game?session_id=${data.SessionID}`)
			
		}).catch((err) => {

			handle_error({ 
				err, 
			})

		}).finally(() => setLoading_play(false))

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





		{/* __________________________________________________ Page __________________________________________________ */}
		
		{show_enterNames ? <>

			<div className='create_container create_players'>

				<Previous onClick={() => setShow_enterNames(false)}>
					<div className='create_edit_player-container'>
						<button 
							className='button button-red create_edit_player'
							onClick={remove_player}
						><svg viewBox='0 -960 960 960'><path d='M200-440v-80h560v80H200Z'/></svg></button>
						<button 
							className='button create_edit_player'
							onClick={add_player}
						><svg viewBox='0 -960 960 960'><path d='M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z'/></svg></button>
					</div>
				</Previous>



				<div className='list-container'>
					<DragAndDropNameColorList
						list_edit_players={list_players}
						setList_edit_players={setList_players}
						MAX_LENGTH_PLAYER_NAME={MAX_LENGTH_PLAYER_NAME}
					/>
				</div>



				<CustomButton 
					onClick={play}
					loading={loading_play}
					text='Los!'
				/>

			</div>

		</>:<>
		
			<div className='create_container'>

				<FancyInput 
					id='Name'
					value={name}
					setValue={setName}
					className={name.length > MAX_LENGTH_SESSION_NAME ? 'create_red_input' : ''}
					type='text'
					text='Name für die Partie'
					isRequired={true}
				/>
				


				<div className='create_element'>

					<label>Spaltenanzahl</label>

					<select value={columns} onChange={({ target }) => setColumns(+target.value)}>

						<option value='' disabled>Auswählen</option>
						
						{options_columns.map((e) => <option key={e} value={e}>{e}</option>)}

					</select>

				</div>

				<div className='create_element'>

					<label>Farbe</label>

					<input 
						type='color' 
						value={color}
						onChange={({ target }) => setColor(target.value)}
					/>

				</div>

				<div className='create_element create_preview'>
					<label>Vorschau</label>
					<div style={{ backgroundColor: `${color}70` }}>
						<span>{name}</span>
					</div>
				</div>



				<CustomButton 
					loading={loading_request}
					className='button' 
					onClick={next}
					text='Weiter'
				/>

				<CustomLink 
					onClick={() => navigate('/session/select', { replace: false })}
					text='Spiel laden'
				/>

			</div>
		
		</>}

	</>
}
