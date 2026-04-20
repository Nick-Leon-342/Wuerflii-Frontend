

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Zod__Session_POST, type Type__Session, type Type__Session_PATCH, type Type__Session_POST } from '../../types/Zod__Session'
import Context__ENV_Variables from '@/Provider_And_Context/Provider_And_Context__ENV_Variables'
import { get__session, patch__session, post__session } from '../../api/session/session'
import useErrorHandling from '../../hooks/useErrorHandling'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import Popup__Settings from '@/components/misc/Popup__Settings'
import Custom_Button from '@/components/misc/Custom_Button'
import Previous from '@/components/misc/Previous'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'





export default function Session__Add_And_Edit() {

	const { session_id } 	= useParams()
	const navigate			= useNavigate()
	const { t }				= useTranslation()
	const query_client		= useQueryClient()
	const handle_error		= useErrorHandling()
	const { MAX_COLUMNS }	= useContext(Context__ENV_Variables)
		
	// ____________________ Session ____________________

	const [ name,				setName				] = useState<string>(t('session'))
	const [ color,				setColor			] = useState<string>('#00FF00')
	const [ columns,			setColumns			] = useState<number>(1)

	const options_columns = Array.from({ length: (MAX_COLUMNS || 0) }, (_, index) => index + 1)





	// __________________________________________________ Queries __________________________________________________

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





	// __________________________________________________ Add / Edit __________________________________________________

	const mutate__session_add = useMutation({
		mutationFn: (session_json: Type__Session_POST) => post__session(session_json),
		onSuccess: data => {
			query_client.setQueryData([ 'session', data.id ], data)
			navigate(`/session/${data.id}/players`, { replace: false })
			toast.success(t('successfully.created'))
		}, 
		onError: err => {
			handle_error({
				err, 
			})
		}
	})

	const mutate__session_edit = useMutation({
		mutationFn: (session_json: Type__Session_PATCH) => patch__session(+(session_id || -1), session_json), 
		onSuccess: ( _, session_json ) => {
			query_client.setQueryData([ 'session', session_id ], (prev: Type__Session) => ({ ...prev, ...session_json }))
			navigate(-1)
			toast.success(t('successfully.saved'))
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

		const zod_result = Zod__Session_POST.safeParse({
			Name:		name, 
			Color:		color, 
			Columns:	columns, 
		})
		if(!zod_result.success) return toast.error(t(`error.${zod_result.error.issues[0].message}`))
		

		if(session) {
			mutate__session_edit.mutate(zod_result.data)
		} else {
			mutate__session_add.mutate(zod_result.data)
		}

	}





	return <>

		<Popup__Settings/>





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
				loading={isLoading__session || mutate__session_add.isPending || mutate__session_edit.isPending}
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
