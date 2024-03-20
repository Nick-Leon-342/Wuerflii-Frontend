

import './css/CreateGame.css'

import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { REACT_APP_MAX_PLAYERS, REACT_APP_MAX_COLUMNS,  } from '../logic/utils-env'

import Loader from '../components/Loader'
import OptionsDialog from '../components/Dialog/OptionsDialog'

import CustomLink from '../components/NavigationElements/CustomLink'
import Popup from '../components/Popup'
import EnterNames from './EnterNames'





export default function CreateGame() {

	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()

	const [ show_enterNames, setShow_enterNames ] = useState(false)





	useEffect(() => {

		axiosPrivate.get('/creategame').catch(() => {
			navigate('/login', { replace: true })
		})

	}, [])





	// __________________________________________________Players__________________________________________________

	const maxPlayers = REACT_APP_MAX_PLAYERS || 16
	const [ players, setPlayers ] = useState('')
	const options_players = Array.from({ length: maxPlayers }, (_, index) => index + 1)

	const handleInputChange_players = (event) => {
		
		const intValue = event.target.value
		if (isNaN(parseInt(intValue.substr(intValue.length - 1))) || intValue < 1 || parseInt(intValue) > maxPlayers) return setPlayers(intValue.slice(0, -1))
		setPlayers(intValue)
		
	}





	// __________________________________________________Columns__________________________________________________

	const maxColumns = REACT_APP_MAX_COLUMNS || 10
	const [columns, setColumns] = useState('')
	const options_columns = Array.from({ length: maxColumns }, (_, index) => index + 1)

	const handleInputChange_columns = (event) => {
		
		const intValue = event.target.value
		if (isNaN(parseInt(intValue.substr(intValue.length - 1))) || intValue < 1 || parseInt(intValue) > maxColumns) {return setColumns(intValue.slice(0, -1))}
		setColumns(intValue)
		
	}





	// __________________________________________________ SelectComponent __________________________________________________

	const SelectComponent = ({ text, value, handleValueChange, defaultText, list }) => {

		return (
			<div className='creategame_select'>

				<label>{text}</label>

				<select value={value} onChange={handleValueChange}>

					<option value='' disabled>{defaultText}</option>
					
					{list.map((e) => <option key={e} value={e}>{e}</option>)}

				</select>

			</div>
		)

	}





	return (
		<>

			{/* __________________________________________________ Dialogs __________________________________________________ */}

			<OptionsDialog/>





			{/* __________________________________________________ Page __________________________________________________ */}
			
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



			<button className='button button-thick' onClick={() => players && columns && setShow_enterNames(true)}>Weiter</button>

			<CustomLink linkTo='/selectsession' text='Lade Spiel'/>








			<Popup 
				showPopup={show_enterNames} 
				setShowPopup={setShow_enterNames}
			>
				<div className='creategame_popup-enternames'>
					<EnterNames 
						columns={columns} 
						players={players}
					/>
				</div>
			</Popup>

		</>
	)
}
