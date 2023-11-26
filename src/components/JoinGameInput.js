

import { useState } from 'react'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'
import FancyInput from './FancyInput'
import Loader from './Loader'
import ErrorMessage from './ErrorMessage'





export default function JoinGameInput({ width, marginBetween, marginBottom, marginTop }) {

	const navigate = useNavigate()
	const [ error, setError ] = useState('')
	const [ joinCode, setJoinCode ] = useState('')
	const [ loaderVisible, setLoaderVisible ] = useState(false)





	const joinGame = async ()  => {

		const JoinCode = +joinCode
		setError('')

		if(JoinCode && 10000000 < JoinCode && 99999999 > JoinCode) {

			setLoaderVisible(true)

			await axios.post('/joingame', 
				{ JoinCode },
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true,
				}
			).then(() => {
				
				navigate(`/joingame?joincode=${joinCode}`, { replace: true })

			}).catch((err) => {
				
				if(!err?.response) {
					setError('Der Server antwortet nicht!')
				} else if (err?.response?.status === 404) {
					setError('Der Code wurde nicht gefunden!')
				} else {
					setError('Es trat ein Fehler beim Server auf!')
				}

			})

			setLoaderVisible(false)

		} else {
			setError('Bitte 8 Zahlen eingeben!')
		}

	}





	return (

		<div 
			style={{ 
				width: width + 'px', 
				display: 'flex', 
				flexDirection: 'column',
				marginTop: marginTop, 
				marginBottom: marginBottom, 
			}}
		>

			<FancyInput
				id='JoinCode'
				type='text'
				text='Beitrittscode'
				maxLength={8}
				value={joinCode}
				setValue={setJoinCode}
				isRequired={true}
			/>

			<Loader loaderVisible={loaderVisible}/>

			<ErrorMessage error={error}/>

			<button 
				className='button' 
				onClick={joinGame}
				style={{ 
					width: '100%', 
					height: '60px',
					marginBottom: '0', 
					marginTop: marginBetween, 
				}}
			>Spiel beitreten</button>

		</div>
		
	)

}
