

import './scss/Game_Options.scss'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from '../Popup/Popup'
import Loader from '../Loader/Loader'
import LoaderBox from '../Loader/Loader_Box'

import Person_Settings from '../../svg/Person_Settings.svg?react'

import { patch__session } from '../../api/session/session'
import type { Type__Session } from '../../types/Type__Session'
import type { Type__Client_To_Server__Session__PATCH } from '../../types/Type__Client_To_Server/Type__Client_To_Server__Session__PATCH'
import type { Type__Enum__Input_Type } from '../../types/Type__Enum/Type__Enum__Input_Type'





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
				tmp.InputType = json.InputType || 'select'
				return tmp
			})
		}
	})

	function change_inputType(event: React.ChangeEvent<HTMLSelectElement>) {

		const json = {
			SessionID: session.id, 
			InputType: event.target.value as Type__Enum__Input_Type
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
				tmp.Scores_Visible = Boolean(json.Scores_Visible)
				return tmp
			})
		}
	})

	function change__scores_visible(event: React.ChangeEvent<HTMLInputElement>): void {

		const json = {
			SessionID: session.id, 
			Scores_Visible: event.target.checked
		}
		mutate__show_scores.mutate(json)

	}


	// __________________________________________________ New Game __________________________________________________

	function new_game(): void {

		if(!window.confirm('Sicher, dass dieses Spiel gelöscht werden soll?')) return 
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
			title='Einstellungen'
			show_popup={show_options}
			setShow_popup={setShow_options}
		>
			<div className='game_options'>

				{/* __________________________________________________ InputType __________________________________________________ */}

				<section>
					<label>Eingabetyp</label>

					{mutate__input_type.isPending && <LoaderBox className='game_options_loader-inputtype' dark={true}/>}

					{!mutate__input_type.isPending && <>
						<select
							value={session?.InputType}
							onChange={change_inputType}
						>
							<option value='select' key='select'>Auswahl</option>
							<option value='select_and_type' key='select_and_type'>Auswahl und Eingabe</option>
							<option value='type' key='type'>Eingabe</option>
						</select>
					</>}
				</section>



				{/* __________________________________________________ Scores_Visible __________________________________________________ */}

				<section>
					<label>Summe anzeigen</label>

					{mutate__show_scores.isPending && <LoaderBox className='game_options_loader-showscores' dark={true}/>}

					{!mutate__show_scores.isPending && <>
						<input
							type='checkbox'
							checked={session?.Scores_Visible}
							onChange={change__scores_visible}
						/>
					</>}
				</section>



				{/* __________________________________________________ Edit __________________________________________________ */}

				<section>
					<label>Spieler bearbeiten</label>

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
					>Aufgeben</button>
				</section>



				{/* __________________________________________________ New Game __________________________________________________ */}

				<section>
					{loading_newGame && <Loader loading={true}/>}
					{!loading_newGame && <>
						<button 
							onClick={new_game} 
							className='button'
						>Spiel verwerfen</button>
					</>}
				</section>

			</div>
		</Popup>
	</>
}
