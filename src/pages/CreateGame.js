

import '../App.css'
import './css/CreateGame.css'
import utils from './utils.js'
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'

import React, { useEffect, useState } from 'react'


function CreateGame() {

	const { setAuth } = useAuth()
	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()

//__________________________________________________Check SessionStorage before displaying__________________________________________________

// document.addEventListener('DOMContentLoaded', function() {

//     const p = sessionStorage.getItem(utils.sessionStorage_players)
//     const ga = sessionStorage.getItem(utils.sessionStorage_gameAttributes)
//     const o = sessionStorage.getItem(utils.sessionStorage_offsetWidth)
//     if(p && !p.isNaN && ga && o) {
//         if(window.confirm('Es wurde ein Spiel gefunden!\nSoll es geladen werden?')) {
//             window.location.replace('/game')
//         } else {
//             ok()
//         }
//     } else {
//         ok()
//     }


// }, false)

	const [players, setPlayers] = useState('')
	const [columns, setColumns] = useState('')

	const next = () => {

		// const playercount = document.getElementById('players').value
		// gameAttributes = createGameAttributes(document.getElementById('columns').value)

		// if(isNaN(playercount) || isNaN(gameAttributes.Columns) || playercount == 0 || gameAttributes.Columns == 0 || playercount > 16 || gameAttributes.Columns > 10) {return}

		// sessionStorage.setItem(sessionStorage_players, playercount)
		// sessionStorage.setItem(sessionStorage_gameAttributes, JSON.stringify(gameAttributes))

		// window.location.replace('/enternames')

	}

	const logout = () => {
		axiosPrivate.delete('/logout').then((res) => {
			if(res.status === 204) {
				setAuth({ accessToken: '' })
				navigate('/login', { replace: true })
			}
		})
	}

	const switchToSelectSession = () => {window.location.replace('/SelectSession')}


	return (
		<>
			<button className="button" onClick={logout}>Ausloggen</button>
			<div className='input-container'>
				<label>Players</label>
				<input 
					className='input' 
					list='players' 
					type='number'
					min='0'
					max='16'
				/>
				<datalist id='players'>
					<option>0</option>
					<option>1</option>
					<option>2</option>
					<option>3</option>
					<option>4</option>
				</datalist>

				<input 
					id='players' 
					className='input' 
					type='number' 
					min='0'
					onChange={(e) => setPlayers(e.target.value)}
					value={players}
				/>
			</div>
			<br/>
			<div className='input-container'>
				<label>Columns</label>
				<input 
					id='columns' 
					className='input' 
					type='number' 
					min='0'
					onChange={(e) => setColumns(e.target.value)}
					value={columns}
				/>
			</div>
			<br/>
			<div className='button-container'>
				<button className='button' onClick={switchToSelectSession}>Lade Spiel</button>
				<button className='button' onClick={next}>Weiter</button>
			</div>
		</>
	)
}

export default CreateGame
