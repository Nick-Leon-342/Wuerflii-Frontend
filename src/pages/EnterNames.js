

import '../App.css'
import './css/EnterNames.css'

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createAttributes, createPlayer, sessionStorage_players, sessionStorage_attributes, sessionStorage_session } from './utils'
import { isMobile } from 'react-device-detect'
import useAxiosPrivate from '../hooks/useAxiosPrivate'


function EnterNames() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	
	const players = Array.from({ length: sessionStorage.getItem(sessionStorage_players) }, (_, index) => index)
	const columns = sessionStorage.getItem(sessionStorage_attributes)

	const [names, setNames] = useState(players.map((p) => `Player_${p + 1}`))
	const [colors, setColors] = useState(players.map((p) => (p % 2 === 0 ? '#ffffff' : '#ADD8E6')))
  
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
			sessionStorage.removeItem(sessionStorage_attributes)
			return navigate('/creategame', { replace: true })
		}

	}, [])

	const play = () => {

		const attributes = createAttributes(columns)
		const players = []

		for(let i = 0; names.length > i; i++) {
			players.push(createPlayer(names[i], `Player_${i}`, colors[i]))
		}

		sessionStorage.setItem(sessionStorage_session, JSON.stringify({ Attributes: attributes, List_Players: players}))
		sessionStorage.removeItem(sessionStorage_players)
		sessionStorage.removeItem(sessionStorage_attributes)

		navigate('/game', { replace: true })

	}

	const clear = () => {
		sessionStorage.removeItem(sessionStorage_players)
		sessionStorage.removeItem(sessionStorage_attributes)
	}

	return (
		<>
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
