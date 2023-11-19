

import { useState } from 'react'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'





export default function JoinGameInput({ width, margin }) {

	const navigate = useNavigate()
	const [ joinCode, setJoinCode ] = useState('')





	const handleJoinCodeInput = (e) => {

		setJoinCode(e.target.value)

	}

	const joinGame = ()  => {

		const JoinCode = +joinCode

		if(JoinCode && 10000000 < JoinCode && 99999999 > JoinCode) {

			axios.post('/joingame', 
				{ JoinCode },
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true,
				}
			).then(() => {

				navigate(`/joingame?joincode=${joinCode}`, { replace: false })

			}).catch((err) => {

				const status = err?.response?.status
				if(status === 404) {
					window.alert('Der Code wurde nicht gefunden!')
				} else {
					window.alert('Es trat ein Fehler beim Server auf!')
				}

			})

		} else {
			window.alert('Bitte 8 Zahlen eingeben!')
		}

	}





	return (

		<div 
			style={{ 
				width: width 
			}}
		>

			<input 
				style={{ 
					boxSizing: 'border-box', 
					width: '100%', 
					textAlign: 'center', 
				}} 
				placeholder='8-stelliger Beitrittscode' 
				maxLength={8}
				value={joinCode}
				onInput={handleJoinCodeInput}
			/>

			<button 
				className='button' 
				onClick={joinGame}
				style={{ 
					width: '100%', 
					marginBottom: '0', 
					marginTop: margin, 
				}}
			>Spiel beitreten</button>

		</div>
		
	)

}
