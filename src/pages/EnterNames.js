

import '../App.css'
import './css/EnterNames.css'

import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { createSession, createPlayer } from '../logic/utils'
import { isMobile } from 'react-device-detect'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Loader from '../components/Loader'


function EnterNames() {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()
	
	const location = useLocation()
	const params = new URLSearchParams(location.search)
	const players = Array.from({ length: params.get('players') }, (_, index) => index)
	const columns = params.get('columns')

	const [ names, setNames ] = useState(players.map((p) => `Spieler_${p + 1}`))
	const [ colors, setColors ] = useState(players.map((p) => (p % 2 === 0 ? '#ffffff' : '#ADD8E6')))
	const [ sessionName, setSessionName ] = useState('Partie')
	const [ loaderVisible, setLoaderVisible ] = useState(false)
	const [ disablePlay, setDisablePlay ] = useState(false)
  




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
			return navigate('/creategame', { replace: true })
		}

	}, [])





	const play = async () => {

		if(sessionName) {

			setDisablePlay(true)
			setLoaderVisible(true)
			const list_players = []
	
			for(let i = 0; names.length > i; i++) {
				list_players.push(createPlayer(names[i], colors[i]))
			}

			const session = createSession(sessionName, columns, list_players)
			await axiosPrivate.post('/enternames',
				session,
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				}
			).then((res) => {

				navigate(`/game?sessionid=${res?.data?.SessionID}&joincode=${res?.data?.JoinCode}`)
				
			}).catch((err) => {
				console.log(err)
				navigate('/creategame', { replace: true })
			})
			
			setLoaderVisible(false)
			setDisablePlay(false)

		}

	}





	return (
		<>

			<div className='inputfield' style={{ marginBottom: '40px' }}>
				<input
					type='text'
					id='SessionName'
					autoComplete='off'
					onChange={(e) => setSessionName(e.target.value)}
					value={sessionName}
					required
				/>
				<label htmlFor='SessionName'>Name für die Partie</label>
			</div>

			<dl>
				{players.map((p, index) => (
					<dt className='enterNamesElement' key={index}>
						<input
							defaultValue={names[index]}
							onChange={(e) => handleNameChange(index, e.target.value)}
							style={{
								height: '30px', 
								margin: '5px 0', 
								width: '85%',
								color: 'var(--text-color)', 
								backgroundColor: 'var(--background-color', 
								border: '1px solid var(--text-color-light)', 
								borderRadius: '5px', 
								padding: '2px 10px', 
								outline: 'none', 
							}}
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

			<Loader loaderVisible={loaderVisible}/>

			<button 
				className='button' 
				onClick={play}
				disabled={disablePlay}
				style={{ 
					width: '100%', 
					marginBottom: '0px', 
					height: '50px', 
				}}
			>Los!
			</button>

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<p className='link-switch'>
					<Link to='/creategame'>Zurück</Link>
				</p>
			</div>

		</>
	)
}

export default EnterNames
