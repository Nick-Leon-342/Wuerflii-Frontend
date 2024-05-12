

import './scss/Create.scss'

import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import FancyInput from '../../components/others/FancyInput'
import CustomButton from '../../components/others/Custom_Button'
import OptionsDialog from '../../components/Dialog/OptionsDialog'
import Previous from '../../components/NavigationElements/Previous'
import CustomLink from '../../components/NavigationElements/CustomLink'





export default function Create() {

	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()

	const [ show_enterNames, setShow_enterNames ] = useState(false)





	useEffect(() => {

		axiosPrivate.get('/game/create').then(({ data }) => {

			const { MAX_PLAYERS } = data
			setMAX_PLAYERS(MAX_PLAYERS)
			setOptions_players(Array.from({ length: MAX_PLAYERS }, (_, index) => index + 1))


			const { MAX_COLUMNS } = data
			setMAX_COLUMNS(MAX_COLUMNS)
			setOptions_columns(Array.from({ length: MAX_COLUMNS }, (_, index) => index + 1))

		}).catch((err) => {

			if(!err?.response) {
				window.alert('Server antwortet nicht!')
			} else {
				navigate('/login', { replace: true })
			}
		})

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

	const [columns, setColumns] = useState('')
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

	const [ names, setNames ] = useState([])
	const [ colors, setColors ] = useState([])
	const [ sessionName, setSessionName ] = useState('Partie')
	const [ loading_enterNames, setLoading_enterNames ] = useState(false)

	const handleNameChange = (index, n) => {

		const updatedNames = [...names]
		updatedNames[index] = n
		setNames(updatedNames)

	}
  
	const handleColorChange = (index, c) => {

		const updatedColors = [...colors]
		updatedColors[index] = c
		setColors(updatedColors)

	}

	useEffect(() => {

		const list_players = Array.from({ length: players }, (_, index) => index)

		setNames(list_players.map((p) => `Spieler_${p + 1}`))
		setColors(list_players.map((p, i) => (i % 2 === 0 ? '#ffffff' : '#ADD8E6')))


	}, [players])

	const play = () => {

		if(sessionName) {

			setLoading_enterNames(true)
			const list_players = []
	
			for(let i = 0; names.length > i; i++) {
				list_players.push({ 
					Name: names[i], 
					Color: colors[i]
				})
			}

			axiosPrivate.post('/game/create', {
				SessionName: sessionName, 
				Columns: +columns, 
				List_Players: list_players,
			}).then(({ data }) => {

				navigate(`/game?session_id=${data.SessionID}&joincode=${data.JoinCode}`)
				
			}).catch((err) => {

				const status = err?.response?.status
				if(!err?.response) {
					window.alert('Server antwortet nicht!')
				} else if(status === 400) {
					window.alert('Fehlerhafte Clientanfrage!')
				} else if(status === 500) {
					window.alert('Beim Server trat ein Fehler auf!')
				} else {
					console.log(err)
					window.alert('Es trat ein ungewollter Fehler auf!')
				}


			}).finally(() => { setLoading_enterNames(false) })			

		}

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
						value={sessionName}
						setValue={setSessionName}
						type='text'
						text='Name für die Partie'
						isRequired={true}
					/>



					<div className='list-container'>
						<ul>
							{names.map((n, index) => (
								<li key={index}>
									<input
										type='text'
										defaultValue={n}
										onChange={(e) => handleNameChange(index, e.target.value)}
									/>
									<input
										type='color'
										value={colors[index]}
										onChange={(e) => handleColorChange(index, e.target.value)}
									/>
								</li>
							))}
						</ul>
					</div>



					<CustomButton 
						onClick={play}
						loading={loading_enterNames}
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



					<button 
						className='button' 
						onClick={() => players && columns && setShow_enterNames(true)}
					>Weiter</button>

					<CustomLink 
						onClick={() => navigate('/session/select', { replace: false })}
						text='Lade Spiel'
					/>

				</div>
			
			</>}

		</>
	)
}
