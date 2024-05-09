

import './scss/EnterNames.scss'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

import Loader from '../components/others/Loader'
import FancyInput from '../components/others/FancyInput'





export default function EnterNames({ columns, players }) {

	const navigate = useNavigate()
	const axiosPrivate = useAxiosPrivate()

	const [ names, setNames ] = useState([])
	const [ colors, setColors ] = useState([])
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

		const list_players = Array.from({ length: players }, (_, index) => index)

		setNames(list_players.map((p) => `Spieler_${p + 1}`))
		setColors(list_players.map((p, i) => (i % 2 === 0 ? '#ffffff' : '#ADD8E6')))


	}, [players])





	const play = () => {

		if(sessionName) {

			setDisablePlay(true)
			setLoaderVisible(true)
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

				console.log(err)
				window.alert('Es trat ein Fehler auf!')
				window.location.reload()

			}).finally(() => {
				
				setLoaderVisible(false)
				setDisablePlay(false)

			})			

		}

	}





	return (
		<div className='enternames_container'>

			<FancyInput 
				id='SessionName'
				value={sessionName}
				setValue={setSessionName}
				type='text'
				text='Name für die Partie'
				isRequired={true}
			/>



			<div className='enternames_list-container'>
				<ul className='enternames_list'>
					{names.map((n, index) => (
						<li key={index}>
							<input
								type='text'
								defaultValue={n}
								onChange={(e) => handleNameChange(index, e.target.value)}
							/>
							<input
								className={isMobile ? 'colorbox-mobile' : 'colorbox-computer'}
								type='color'
								value={colors[index]}
								onChange={(e) => handleColorChange(index, e.target.value)}
							/>
						</li>
					))}
				</ul>
			</div>



			<Loader loaderVisible={loaderVisible}/>

			<button 
				className='button button-thick' 
				onClick={play}
				disabled={disablePlay}
			>Los!</button>

		</div>
	)
}
