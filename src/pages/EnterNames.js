

import '../App.css'
import './css/EnterNames.css'

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createSession, createPlayer, sessionStorage_players, sessionStorage_columns, sessionStorage_session } from './utils'
import { isMobile } from 'react-device-detect'
import useAxiosPrivate from '../hooks/useAxiosPrivate'


function EnterNames() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	
	const players = Array.from({ length: sessionStorage.getItem(sessionStorage_players) }, (_, index) => index)
	const columns = +sessionStorage.getItem(sessionStorage_columns)

	const [names, setNames] = useState(players.map((p) => `Spieler_${p + 1}`))
	const [colors, setColors] = useState(players.map((p) => (p % 2 === 0 ? '#ffffff' : '#ADD8E6')))
	const [sessionName, setSessionName] = useState('Partie')
  




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

		async function connect() {
			await axiosPrivate.get('/enternames',
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			).catch(() => {
				navigate('/login', { replace: true })
			})
		}

		connect()

		if(players.length === 0 || !columns || isNaN(columns)) {
			sessionStorage.removeItem(sessionStorage_players)
			sessionStorage.removeItem(sessionStorage_columns)
			return navigate('/creategame', { replace: true })
		}

	}, [])





	const play = () => {

		if(sessionName) {

			const list_playerOrder = []
			const list_players = []
	
			for(let i = 0; names.length > i; i++) {
				const alias = `Player_${i}`
				list_playerOrder.push(alias)
				list_players.push(createPlayer(names[i], alias, colors[i]))
			}

			const session = createSession(sessionName, columns, list_playerOrder, list_players)
	
			sessionStorage.setItem(sessionStorage_session, JSON.stringify(session))
			sessionStorage.removeItem(sessionStorage_players)
			sessionStorage.removeItem(sessionStorage_columns)
	
			navigate('/game', { replace: true })

		}

	}

	const clear = () => {

		sessionStorage.removeItem(sessionStorage_players)
		sessionStorage.removeItem(sessionStorage_columns)

	}





	return (
		<>
		
			<div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
				<p htmlFor='Username' className='input-header' style={{ color: 'black', height: '25px', marginTop: '20px', display: 'flex' }}>
					<span style={{ height: '100%', marginLeft: '7px', marginRight: '5px' }}>Name für die Partie</span>
				</p>
				<input required value={sessionName} onChange={(e) => setSessionName(e.target.value)} style={{ width: '455px' }}/>
			</div>

			<dl id='enterNamesList'>
				{players.map((p, index) => (
					<dt className='enterNamesElement' key={index}>
						<input
							defaultValue={names[index]}
							onChange={(e) => handleNameChange(index, e.target.value)}
						/>
						<input
							className={isMobile ? 'colorbox-mobile' : 'colorbox-computer'}
							type='color'
							value={colors[index]}
							onChange={(e) => handleColorChange(index, e.target.value)}
						/>
					</dt>
				))}
			</dl>

			<button className='button' style={{ width: '100%', marginBottom: '0px' }} onClick={play}>Los!</button>

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<p className='link-switch'>
					<Link onClick={clear} to='/creategame'>Zurück</Link>
				</p>
			</div>

		</>
	)
}

export default EnterNames
