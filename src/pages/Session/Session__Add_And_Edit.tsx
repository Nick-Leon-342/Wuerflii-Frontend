

import './scss/Session__Add_And_Edit.scss'

import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import CustomButton from '../../components/misc/Custom_Button'
import OptionsDialog from '../../components/Popup/Popup__Options'
import Previous from '../../components/NavigationElements/Previous'
import Custom_Link from '../../components/NavigationElements/Custom_Link'

import { get__user } from '../../api/user'
import { get__session, get__session_env_variables, patch__session, post__session } from '../../api/session/session'

import Context__Error from '../../Provider_And_Context/Provider_And_Context__Error'

import type { Type__Session } from '../../types/Type__Session'
import type { Type__Client_To_Server__Session__POST } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session__POST'
import type { Type__Client_To_Server__Session__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session__PATCH'





export default function Session__Add_And_Edit() {

	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const { session_id } = useParams()
	const { setError } = useContext(Context__Error)

	
	// ____________________ Session ____________________

	const [ name,				setName				] = useState<string>('Partie')
	const [ color,				setColor			] = useState<string>('#00FF00')
	const [ columns,			setColumns			] = useState<number>(0)

	const [ options_columns,	setOptions_columns	] = useState<Array<number>>([])





	// __________________________________________________ Queries __________________________________________________

	// ____________________ User ____________________

	const { data: user, isLoading: isLoading__user, error: error__user } = useQuery({
		queryKey: [ 'user' ], 
		queryFn: () => get__user(axiosPrivate), 
	})

	if(error__user) {
		handle_error({
			err: error__user, 
		})
	}


	// ____________________ Session ____________________

	const { data: session, isLoading: isLoading__session, error: error__session } = useQuery({
		queryFn: () => get__session(axiosPrivate, +(session_id || -1)), 
		queryKey: [ 'session', +(session_id || -1) ], 
		enabled: Boolean(session_id), 
	})

	if(error__session) {
		handle_error({
			err: error__session, 
			handle_404: () => {
				alert('Die Partie wurde nicht gefunden')
				navigate('/', { replace: true })
			}
		})
	}

	useEffect(() => {
		function initialize_existing_session() {
			if(!session) return	
			setName(session.Name)
			setColor(session.Color)
			setColumns(session.Columns)
		}
		initialize_existing_session()
	}, [ session ])


	// ____________________ Env_Variables ____________________

	const { data: env_variables, isLoading: isLoading__env_variables, error: error__env_variables } = useQuery({
		queryFn: () => get__session_env_variables(axiosPrivate), 
		queryKey: [ 'session', 'env' ], 
	})

	if(error__env_variables) {
		handle_error({
			err: error__env_variables, 
		})
	}

	useEffect(() => setOptions_columns(Array.from({ length: (env_variables?.MAX_COLUMNS || 0) }, (_, index) => index + 1)), [ env_variables ]) // eslint-disable-line





	// __________________________________________________ Add / Edit __________________________________________________

	const mutate__session_add = useMutation({
		mutationFn: (session_json: Type__Client_To_Server__Session__POST) => post__session(axiosPrivate, session_json),
		onSuccess: data => {
			query_client.setQueryData([ 'session', data.id ], data)
			navigate(`/session/${data.id}/players`, { replace: false })
		}, 
		onError: err => {
			handle_error({
				err, 
			})
		}
	})

	const mutate__session_edit = useMutation({
		mutationFn: (session_json: Type__Client_To_Server__Session__PATCH) => patch__session(axiosPrivate, session_json), 
		onSuccess: ( _, session_json ) => {
			query_client.setQueryData([ 'session', session_json.SessionID ], (prev: Type__Session) => ({ ...prev, ...session_json }))
			navigate(-1)
		}, 
		onError: err => {
			handle_error({
				err, 
				handle_404: () => {
					alert('Die Partie wurde nicht gefunden.')
					navigate('/', { replace: true })
				}
			})
		}
	})

	const ok = async () => {

		if(!env_variables) return setError('Beim Laden der Seit ist etwas schiefgelaufen. Bitte erneut versuchen.')
		
		if(!name)													return setError('Bitte einen Namen für die Parte eingeben.')
		if(name.length > env_variables?.MAX_LENGTH_SESSION_NAME) 	return setError(`Der Name der Partie darf nicht länger als ${env_variables?.MAX_LENGTH_SESSION_NAME} Zeichen sein.`)
		if(!session && !+columns) 									return setError('Bitte die Spaltenanzahl angeben.')
		if(!session && +columns > env_variables?.MAX_COLUMNS) 		return setError(`Die maximale Spaltenanzahl ist ${env_variables?.MAX_COLUMNS}.`) 

		if(session) {
			mutate__session_edit.mutate({
				SessionID:	session.id, 
				Name: 		name, 
				Color: 		color, 
				Columns: 	+columns, 
			})
		} else {
			mutate__session_add.mutate({
				Name:		name, 
				Color:		color, 
				Columns:	+columns, 
			})
		}

	}





	return <>

		<OptionsDialog user={user}/>





		{/* __________________________________________________ Page __________________________________________________ */}
		
		<div className='session__add_and_edit'>

			{session_id && <Previous onClick={() => navigate(-1)}/>}



			{/* ____________________ Name ____________________ */}

			<input 
				value={name}
				onChange={(event) => setName(event.target.value)}
				placeholder='Name of match'
				style={{ 
					backgroundColor: color + '70', 
					border: '2px solid', 
					borderColor: color + '90', 
				}}
			/>
			


			{/* ____________________ Columns and Color ____________________ */}

			<div className='session__add_and_edit__columns_and_color'>
				<div className='session__add_and_edit__columns'>
					<span>Spalten:</span>
					<select 
						value={columns} 
						onChange={({ target }) => setColumns(+target.value)}
					>
						<option value='' disabled>Auswählen</option>
						{options_columns.map((e) => <option key={e} value={e}>{e}</option>)}
					</select>
				</div>

				<div className='session__add_and_edit__color'>
					<span>Farbe:</span>
					<input 
						type='color' 
						value={color}
						onChange={({ target }) => setColor(target.value)}
					/>
				</div>
			</div>



			<CustomButton 
				loading={isLoading__user || isLoading__session || isLoading__env_variables}
				className='button' 
				text={session_id ? 'Speichern' : 'Weiter'}
				onClick={ok}
			/>

			{!session_id && <>
				<Custom_Link 
					onClick={() => navigate('/', { replace: false })}
					text='Spiel laden'
				/>
			</>}

		</div>

	</>
}
