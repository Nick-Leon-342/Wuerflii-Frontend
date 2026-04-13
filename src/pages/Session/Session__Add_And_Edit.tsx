

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import type { Type__Client_To_Server__Session__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session__PATCH'
import type { Type__Client_To_Server__Session__POST } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session__POST'
import { get__session, get__session_env_variables, patch__session, post__session } from '../../api/session/session'
import type { Type__Session } from '../../types/Zod__Session'
import useErrorHandling from '../../hooks/useErrorHandling'
import { get__user } from '../../api/user'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import Popup__Settings from '@/components/misc/Popup__Settings'
import Custom_Button from '@/components/misc/Custom_Button'
import Previous from '@/components/misc/Previous'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'





export default function Session__Add_And_Edit() {

	const navigate		= useNavigate()
	const { t }			= useTranslation()
	const query_client	= useQueryClient()
	const handle_error	= useErrorHandling()

	const { session_id } = useParams()

	
	// ____________________ Session ____________________

	const [ name,				setName				] = useState<string>(t('session'))
	const [ color,				setColor			] = useState<string>('#00FF00')
	const [ columns,			setColumns			] = useState<number>(1)

	const [ options_columns,	setOptions_columns	] = useState<Array<number>>([])





	// __________________________________________________ Queries __________________________________________________

	// ____________________ User ____________________

	const { data: user, isLoading: isLoading__user, error: error__user } = useQuery({
		queryKey: [ 'user' ], 
		queryFn: () => get__user(), 
	})

	if(error__user) {
		handle_error({
			err: error__user, 
		})
	}


	// ____________________ Session ____________________

	const { data: session, isLoading: isLoading__session, error: error__session } = useQuery({
		queryFn: () => get__session(+(session_id || -1)), 
		queryKey: [ 'session', +(session_id || -1) ], 
		enabled: Boolean(session_id), 
	})

	if(error__session) {
		handle_error({
			err: error__session, 
			handle_404: () => {
				toast.error(t('session_not_found'))
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
		queryFn: () => get__session_env_variables(), 
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
		mutationFn: (session_json: Type__Client_To_Server__Session__POST) => post__session(session_json),
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
		mutationFn: (session_json: Type__Client_To_Server__Session__PATCH) => patch__session(session_json), 
		onSuccess: ( _, session_json ) => {
			query_client.setQueryData([ 'session', session_json.SessionID ], (prev: Type__Session) => ({ ...prev, ...session_json }))
			navigate(-1)
		}, 
		onError: err => {
			handle_error({
				err, 
				handle_404: () => {
					toast.error(t('session_not_found'))
					navigate('/', { replace: true })
				}
			})
		}
	})

	const ok = async () => {

		if(!env_variables) return toast.error(t('error.generic'))
		
		if(!name)													return toast.error(t('error.name_required'))
		if(name.length > env_variables?.MAX_LENGTH_SESSION_NAME) 	return toast.error(t('error.name_too_long', { max: env_variables.MAX_LENGTH_SESSION_NAME }))
		if(!session && !+columns) 									return toast.error(t('error.columns_required'))
		if(!session && +columns > env_variables?.MAX_COLUMNS) 		return toast.error(t('error.columns_too_many', { max: env_variables.MAX_COLUMNS })) 

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

		<Popup__Settings user={user}/>





		<div className='session__add_and_edit flex flex-col w-9/10 gap-4 md:w-150'>

			{session_id && <Previous onClick={() => navigate(-1)}/>}



			{/* ____________________ Name ____________________ */}
			<Input 
				onChange={(event) => setName(event.target.value)}
				placeholder={t('name_of_match')}
				className='text-xl! h-12'
				value={name}
				style={{ 
					backgroundColor: color + '70', 
					border: '2px solid ' + color + '90', 
				}}
			/>
			


			{/* ____________________ Columns and Color ____________________ */}

			<div className='flex flex-col md:flex-row gap-4 md:gap-20 justify-between'>
				<Select
					value={columns.toString()}
					onValueChange={(value) => setColumns(+value)}
				>
					<SelectTrigger>
						<SelectValue/>
					</SelectTrigger>

					<SelectContent>
						<SelectGroup>
							<SelectLabel>{t('columns')}</SelectLabel>
							{options_columns.map(column => (
								<SelectItem
									key={column}
									value={column.toString()}
									className='text-lg cursor-pointer'
								>{column}</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>

				<div className='flex flex-row justify-between items-center w-full'>
					<span className='text-lg'>{t('color')}:</span>
					<Input 
						className='p-0 border-none w-12 h-12 bg-transparent cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0  [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-none'
						onChange={({ target }) => setColor(target.value)}
						value={color}
						type='color' 
					/>
				</div>
			</div>



			<Custom_Button 
				loading={isLoading__user || isLoading__session || isLoading__env_variables || mutate__session_add.isPending || mutate__session_edit.isPending}
				text={session_id ? t('save') : t('create_session')}
				onClick={ok}
			/>



			{!session_id && <>
				<Button
					variant='link'
					className='p-0 w-fit h-fit text-md'
					onClick={() => navigate('/', { replace: false })}
				>{t('load_session')}</Button>
			</>}

		</div>

	</>
}
