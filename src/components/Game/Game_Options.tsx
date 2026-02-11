

import './scss/Game_Options.scss'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import useErrorHandling from '../../hooks/useErrorHandling'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import LoaderBox from '../Loader/Loader_Box'
import Loader from '../Loader/Loader'
import Popup from '../Popup/Popup'

import Person_Settings from '../../svg/Person_Settings.svg?react'

import type { Type__Client_To_Server__Session__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session__PATCH'
import type { Enum__Input_Type } from '../../types/Enum/Enum__Input_Type'
import type { Type__Session } from '../../types/Type__Session'

import { patch__session } from '../../api/session/session'
import { useTranslation } from 'react-i18next'





interface Props__Game_Options {
	setShow_surrender:	React.Dispatch<React.SetStateAction<boolean>>

	setShow_options:	React.Dispatch<React.SetStateAction<boolean>>
	show_options:		boolean

	session:			Type__Session
}

export default function Game_Options({
	setShow_surrender, 

	setShow_options, 
	show_options, 

	session, 
}: Props__Game_Options) {

	const navigate = useNavigate()
	const { t } = useTranslation()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ loading_newGame, setLoading_newGame ] = useState(false)





	// __________________________________________________ Input Type __________________________________________________

	const mutate__input_type = useMutation({
		mutationFn: (json: Type__Client_To_Server__Session__PATCH) => patch__session(axiosPrivate, json), 
		onSuccess: (_, json) => {
			query_client.setQueryData([ 'session', session.id ], (prev: Type__Session) => {
				if(!prev) return prev
				const tmp = { ...prev }
				tmp.Input_Type = json.Input_Type || 'SELECT'
				return tmp
			})
		}
	})

	function change_inputType(event: React.ChangeEvent<HTMLSelectElement>) {

		const json = {
			SessionID: session.id, 
			Input_Type: event.target.value as Enum__Input_Type
		}
		mutate__input_type.mutate(json)

	}


	// __________________________________________________ Scores Visible __________________________________________________

	const mutate__show_scores = useMutation({
		mutationFn: (json: Type__Client_To_Server__Session__PATCH) => patch__session(axiosPrivate, json), 
		onSuccess: (_, json) => {
			query_client.setQueryData([ 'session', session.id ], (prev: Type__Session) => {
				if(!prev) return prev
				const tmp = { ...prev }
				tmp.Show_Scores = Boolean(json.Show_Scores)
				return tmp
			})
		}
	})

	function change__scores_visible(event: React.ChangeEvent<HTMLInputElement>): void {

		const json = {
			SessionID: session.id, 
			Show_Scores: event.target.checked
		}
		mutate__show_scores.mutate(json)

	}


	// __________________________________________________ New Game __________________________________________________

	function new_game(): void {

		if(!window.confirm(t('sure_you_want_to_delete_this_game'))) return 
		setLoading_newGame(true)
	
		axiosPrivate.delete(`/game?session_id=${session.id}`).then(() => {

			query_client.removeQueries({ queryKey: [ 'session', session.id, 'table_columns' ] })
			navigate('/', { replace: true })

		}).catch((err) => {

			handle_error({ 
				err 
			})

		}).finally(() =>  setLoading_newGame(false))
	
	}





	return <>
		<Popup
			title={t('settings')}
			show_popup={show_options}
			setShow_popup={setShow_options}
		>
			<div className='game_options'>

				{/* __________________________________________________ Input_Type __________________________________________________ */}

				<section>
					<label>{t('input_type.name')}</label>

					{mutate__input_type.isPending && <LoaderBox className='game_options_loader-inputtype' dark={true}/>}

					{!mutate__input_type.isPending && <>
						<select
							value={session?.Input_Type}
							onChange={change_inputType}
						>
							<option value='SELECT' key='SELECT'>{t('input_type.select')}</option>
							<option value='SELECT_AND_TYPE' key='SELECT_AND_TYPE'>{t('input_type.select_and_type')}</option>
							<option value='TYPE' key='TYPE'>{t('input_type.type')}</option>
						</select>
					</>}
				</section>



				{/* __________________________________________________ Show_Scores __________________________________________________ */}

				<section>
					<label>{t('show_scores')}</label>

					{mutate__show_scores.isPending && <LoaderBox className='game_options_loader-showscores' dark={true}/>}

					{!mutate__show_scores.isPending && <>
						<input
							type='checkbox'
							checked={session?.Show_Scores}
							onChange={change__scores_visible}
						/>
					</>}
				</section>



				{/* __________________________________________________ Edit __________________________________________________ */}

				<section>
					<label>{t('edit_players')}</label>

					<Link
						to={`/session/${session?.id}/players`}
						className='button button_reverse button_scale_3 edit'
					><Person_Settings/></Link>
				</section>



				{/* __________________________________________________ Surrender __________________________________________________ */}

				<section>
					<button 
						className='button button_reverse_red'
						onClick={() => setShow_surrender(true)}
					>{t('surrender')}</button>
				</section>



				{/* __________________________________________________ New Game __________________________________________________ */}

				<section>
					{loading_newGame && <Loader loading={true}/>}
					{!loading_newGame && <>
						<button 
							onClick={new_game} 
							className='button'
						>{t('discard_game')}</button>
					</>}
				</section>

			</div>
		</Popup>
	</>
}
