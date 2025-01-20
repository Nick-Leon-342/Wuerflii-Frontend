

import './scss/Session_AddAndEdit.scss'

import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import FancyInput from '../../components/others/FancyInput'
import PopupError from '../../components/Popup/Popup_Error'
import CustomButton from '../../components/others/Custom_Button'
import OptionsDialog from '../../components/Popup/Popup_Options'
import Previous from '../../components/NavigationElements/Previous'
import CustomLink from '../../components/NavigationElements/CustomLink'





export default function Session_AddAndEdit() {

	const axiosPrivate = useAxiosPrivate()
	const navigate = useNavigate()
	const handle_error = useErrorHandling()

	const { session_id } = useParams()

	const [ user, setUser ] = useState()

	const [ error, setError ] = useState('')
	const [ loading, setLoading ] = useState(false)
	const [ loading_request, setLoading_request ] = useState(false)

	
	// ____________________ Session ____________________

	const [ session, setSession ] = useState()

	const [ name, setName ] = useState('Partie')
	const [ MAX_LENGTH_SESSION_NAME, setMAX_LENGTH_SESSION_NAME ] = useState(0)

	const [ color, setColor ] = useState('#00FF00')

	const [ columns, setColumns ] = useState('')
	const [ MAX_COLUMNS, setMAX_COLUMNS ] = useState(0)
	const [ options_columns, setOptions_columns ] = useState([])





	useEffect(() => {

		setLoading_request(true)

		axiosPrivate.get(`/session${session_id ? `?session_id=${session_id}` : ''}`).then(({ data }) => {

			const { 
				User, 
				MAX_COLUMNS, 
				MAX_LENGTH_SESSION_NAME, 
			} = data

			setUser(User)
			if(session_id) {
				const session = data.Session
				setSession(session)
				setName(session.Name)
				setColor(session.Color)
			}

			setMAX_LENGTH_SESSION_NAME(MAX_LENGTH_SESSION_NAME)
			setMAX_COLUMNS(MAX_COLUMNS)
			setOptions_columns(Array.from({ length: MAX_COLUMNS }, (_, index) => index + 1))

		}).catch(err => { 
			
			handle_error({ 
				err, 
				handle_404: () => {
					alert('Session wurde nicht gefunden.')
					navigate(-1, { replace: true })
				}
			}) 
		
		}).finally(() => setLoading_request(false))

		// eslint-disable-next-line
	}, [])

	const ok = async () => {
		
		if(!name) return setError('Bitte einen Namen für die Parte eingeben.')
		if(name.length > MAX_LENGTH_SESSION_NAME) return setError(`Der Name der Partie darf nicht länger als ${MAX_LENGTH_SESSION_NAME} Zeichen sein.`)
		if(!session && !+columns) return setError('Bitte die Spaltenanzahl angeben.')
		if(!session && +columns > MAX_COLUMNS) return setError(`Die maximale Spaltenanzahl ist ${MAX_COLUMNS}.`) 

		setLoading(true)

		try {
			if(session) {
				await axiosPrivate.patch('/session', {
					SessionID: session.id, 
					Name: name, 
					Color: color, 
				})
				navigate(-1, { replace: false })
			} else {
				const { SessionID } = await axiosPrivate.post('/session', {
					Name: name, 
					Color: color, 
					Columns: +columns, 
				})
				navigate(`/session/${SessionID}/players`, { replace: true })
			}
		} catch(err) {
			handle_error({
				err, 
			})
		}

		setLoading(false)

	}





	return <>

		<OptionsDialog
			user={user}
			setUser={setUser}
		/>

		<PopupError
			error={error}
			setError={setError}
		/>





		{/* __________________________________________________ Page __________________________________________________ */}
		
		<div className='session_addandedit'>

			{session_id && <Previous onClick={() => navigate(-1)}/>}



			{/* ____________________ Name ____________________ */}

			<FancyInput 
				id='Name'
				type='text'
				value={name}
				isRequired={true}
				setValue={setName}
				text='Name für die Partie'
				isRed={MAX_LENGTH_SESSION_NAME !== 0 && name.length > MAX_LENGTH_SESSION_NAME}
			/>
			


			{/* ____________________ Columns ____________________ */}

			{!session_id && <>
				<div className='session_addandedit_element'>
					<label>Spaltenanzahl</label>
					<select value={columns} onChange={({ target }) => setColumns(+target.value)}>
						<option value='' disabled>Auswählen</option>
						{options_columns.map((e) => <option key={e} value={e}>{e}</option>)}
					</select>
				</div>
			</>}



			{/* ____________________ Color ____________________ */}

			<div className='session_addandedit_element'>
				<label>Farbe</label>
				<input 
					type='color' 
					value={color}
					onChange={({ target }) => setColor(target.value)}
				/>
			</div>



			{/* ____________________ Preview ____________________ */}

			<div className='session_addandedit_element session_addandedit_preview'>
				<label>Vorschau</label>
				<div style={{ backgroundColor: `${color}70` }}>
					<span>{name}</span>
				</div>
			</div>



			<CustomButton 
				loading={loading || loading_request}
				className='button' 
				text={session_id ? 'Speichern' : 'Weiter'}
				onClick={ok}
			/>

			{!session_id && <>
				<CustomLink 
					onClick={() => navigate('/session/select', { replace: false })}
					text='Spiel laden'
				/>
			</>}

		</div>

	</>
}
