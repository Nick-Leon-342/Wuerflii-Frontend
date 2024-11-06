

import './scss/Create.scss'

import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import FancyInput from '../../components/others/FancyInput'
import CustomButton from '../../components/others/Custom_Button'
import OptionsDialog from '../../components/others/OptionsDialog'
import Previous from '../../components/NavigationElements/Previous'
import CustomLink from '../../components/NavigationElements/CustomLink'
import useErrorHandling from '../../hooks/useErrorHandling'
import DragAndDropNameColorList from '../../components/others/DragAndDropNameColorList'





export default function Create() {

	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()
	const handle_error = useErrorHandling()

	const [ loading_request, setLoading_request ] = useState(false)

	const [ show_enterNames, setShow_enterNames ] = useState(false)





	useEffect(() => {

		async function request() {

			setLoading_request(true)

			await axiosPrivate.get('/game/create').then(({ data }) => {
	
				const { MAX_PLAYERS, MAX_COLUMNS, MAX_LENGTH_PLAYER_NAME } = data

				setMAX_LENGTH_PLAYER_NAME(MAX_LENGTH_PLAYER_NAME)

				setMAX_PLAYERS(MAX_PLAYERS)
				setOptions_players(Array.from({ length: MAX_PLAYERS }, (_, index) => index + 1))
	
	
				setMAX_COLUMNS(MAX_COLUMNS)
				setOptions_columns(Array.from({ length: MAX_COLUMNS }, (_, index) => index + 1))
	
			}).catch(err => { 
				
				handle_error({ err }) 
			
			}).finally(() => setLoading_request(false))
		}

		request()

	}, [])





	// __________________________________________________Players__________________________________________________

	const [ players, setPlayers ] = useState('')
	const [ options_players, setOptions_players ] = useState([])
	const [ MAX_PLAYERS, setMAX_PLAYERS ] = useState(0)

	const handleInputChange_players = (event) => {
		
		const intValue = event.target.value
		if (isNaN(parseInt(intValue.substr(intValue.length - 1))) || intValue < 1 || parseInt(intValue) > MAX_PLAYERS) return setPlayers(intValue.slice(0, -1))
		setPlayers(intValue)
		
	}





	// __________________________________________________Columns__________________________________________________

	const [ columns, setColumns ] = useState('')
	const [ options_columns, setOptions_columns ] = useState([])
	const [ MAX_COLUMNS, setMAX_COLUMNS ] = useState(0)

	const handleInputChange_columns = (event) => {
		
		const intValue = event.target.value
		if (isNaN(parseInt(intValue.substr(intValue.length - 1))) || intValue < 1 || parseInt(intValue) > MAX_COLUMNS) {return setColumns(intValue.slice(0, -1))}
		setColumns(intValue)
		
	}





	// __________________________________________________ SelectComponent __________________________________________________

	const SelectComponent = ({ text, value, handleValueChange, defaultText, list }) => {

		return (
			<div className='create_select'>

				<label>{text}</label>

				<select value={value} onChange={handleValueChange}>

					<option value='' disabled>{defaultText}</option>
					
					{list.map((e) => <option key={e} value={e}>{e}</option>)}

				</select>

			</div>
		)

	}








	// __________________________________________________ EnterNames __________________________________________________

	const [ list_players, setList_players ] = useState([])
	const [ name, setName ] = useState('Partie')
	const [ loading_play, setLoading_play ] = useState(false)
	const [ MAX_LENGTH_PLAYER_NAME, setMAX_LENGTH_PLAYER_NAME ] = useState(0)

	const next = () => {
		
		if(!players || !columns) return

		const tmp = Array.from({ length: players }, (_, index) => index)

		setList_players(tmp.map((p, i) => {
			return {
				id: i, 
				Name: `Spieler_${p + 1}`, 
				Color: i % 2 === 0 ? '#ffffff' : '#ADD8E6'
			}
		}))

		setShow_enterNames(true)

	}

	const play = () => {

		if(!name || !list_players || list_players.some(p => p.Name.length > MAX_LENGTH_PLAYER_NAME)) return

		setLoading_play(true)

		axiosPrivate.post('/game/create', {
			Name: name, 
			Columns: +columns, 
			List_Players: list_players,
		}).then(({ data }) => {

			navigate(`/game?session_id=${data.SessionID}`)
			
		}).catch((err) => {

			handle_error({ 
				err 
			})

		}).finally(() => setLoading_play(false))

	}





	return (
		<>

			{/* __________________________________________________ Dialogs __________________________________________________ */}

			<OptionsDialog/>





			{/* __________________________________________________ Page __________________________________________________ */}
			
			{show_enterNames ? <>

				<div className='create_container'>

					<Previous
						onClick={() => setShow_enterNames(false)}
					/>

					<FancyInput 
						id='SessionName'
						value={name}
						setValue={setName}
						type='text'
						text='Name für die Partie'
						isRequired={true}
					/>



					<div className='list-container'>
						<DragAndDropNameColorList
							List_Players={list_players}
							setList_Players={setList_players}
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

					<SelectComponent 
						text='Spieler' 
						value={players} 
						handleValueChange={handleInputChange_players} 
						defaultText='Spieleranzahl' 
						list={options_players}
					/>
					
					<SelectComponent 
						text='Spalten' 
						value={columns} 
						handleValueChange={handleInputChange_columns} 
						defaultText='Spaltenanzahl' 
						list={options_columns}
					/>



					<CustomButton 
						loading={loading_request}
						className='button' 
						onClick={next}
						text='Weiter'
					/>

					<CustomLink 
						onClick={() => navigate('/session/select', { replace: false })}
						text='Lade Spiel'
					/>

				</div>
			
			</>}

		</>
	)
}
