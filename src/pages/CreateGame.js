


import '../App.css'
import './css/CreateGame.css'

import { Link, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { resizeEvent, sessionStorage_attributes, sessionStorage_players } from './utils'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'

function CreateGame() {
	
	const { setAuth } = useAuth()
	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()


	useEffect(() => {
		resizeEvent()
	}, [])

	

	//____________________Next____________________

	const next = () => {

		if(!players || !columns) return

		sessionStorage.setItem(sessionStorage_players, players)
		sessionStorage.setItem(sessionStorage_attributes, columns)

		navigate('/enternames', { replace: false })

	}


	//____________________Players____________________

	const maxPlayers = process.env.MAX_PLAYERS || 16
	const [players, setPlayers] = useState('')
	const options_players = Array.from({ length: maxPlayers }, (_, index) => index + 1)

	const handleInputChange_players = (event) => {
		
		const intValue = event.target.value
		if (isNaN(parseFloat(intValue)) || intValue < 1 || intValue > maxPlayers) {return setPlayers(intValue.slice(0, -1))}
		setPlayers(intValue)
		
	}


	//____________________Columns____________________

	const maxColumns = process.env.MAX_COLUMNS || 10
	const [columns, setColumns] = useState('')
	const options_columns = Array.from({ length: maxColumns }, (_, index) => index + 1)

	const handleInputChange_columns = (event) => {
		
		const intValue = event.target.value
		if (isNaN(parseFloat(intValue)) || intValue < 1 || intValue > maxColumns) {return setColumns(intValue.slice(0, -1))}
		setColumns(intValue)
		
	}

	const logout = () => {

		axiosPrivate.delete('/logout').then((res) => {
			if(res.status === 204) {
				setAuth({ accessToken: '' })
				navigate('/login', { replace: true })
			}
		})

	}



	return (
		<>
			<div className='input-container'>
				<label className='input-header' style={{ color: 'black' }}>Spieler</label>
				{isMobile ? (
					<select
						className='input input-mobile'
						value={players}
						onChange={handleInputChange_players}
						>
						<option value="" disabled>
							Number of players
						</option>
						{options_players.map((p) => (
							<option key={p} value={p}>{p}</option>
						))}
					</select>
				) : (
					<>
						<input 
							className='input input-computer' 
							list='players'
							value={players}
							onChange={handleInputChange_players}
						/>
						<datalist id='players'>
							{options_players.map((p) => {
								return <option key={p} value={p}/>
							})}
						</datalist>
					</>
				)}
			</div>
			<br/>
			<div className='input-container'>
				<label className='input-header' style={{ color: 'black' }}>Spalten</label>
				{isMobile ? (
					<select
						className='input input-mobile'
						value={columns}
						onChange={handleInputChange_columns}
						>
						<option value="" disabled>
							Columns per player
						</option>
						{options_columns.map((c) => (
							<option key={c} value={c}>{c}</option>
						))}
					</select>
				) : (
					<>
						<input 
							className='input input-computer' 
							list='columns'
							value={columns}
							onChange={handleInputChange_columns}
						/>
						<datalist id='columns'>
							{options_columns.map((c) => {
								return <option key={c} value={c} />
							})}
						</datalist>
					</>
				)}
			</div>
			<br/>
			<button className='button' style={{ width: '100%', marginBottom: '0px' }} onClick={next}>Weiter</button>

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<p className='link-switch'>
					<Link to='/selectsession'>Lade Spiel</Link>
				</p>
				<div className='logout'><button onClick={logout}>Ausloggen</button></div>
			</div>
		</>
	)
}

export default CreateGame
