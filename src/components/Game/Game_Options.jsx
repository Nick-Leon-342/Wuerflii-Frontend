

import './scss/Game_Options.scss'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useErrorHandling from '../../hooks/useErrorHandling'

import Popup from '../Popup/Popup'
import Loader from '../Loader/Loader'
import LoaderBox from '../Loader/Loader_Box'

import { ReactComponent as PersonSettings } from '../../svg/Person_Settings.svg'

import { patch__session } from '../../api/session/session'





/**
 * 
 * Game_Options component that provides game settings, such as input type selection, score visibility toggle,
 * player management, and options for starting a new game or surrendering.
 *
 * @component
 * @example
 * // Example usage of Game_Options component
 * <Game_Options 
 *   setShow_surrender={setShowSurrender} 
 *   setShow_options={setShowOptions} 
 *   show_options={showOptions} 
 *   session={session} 
 * />
 *
 * @param {Object} props - The component props
 * @param {Function} props.setShow_surrender - Function to show/hide surrender option
 * @param {Function} props.setShow_options - Function to show/hide options popup
 * @param {boolean} props.show_options - Boolean value to control visibility of the options popup
 * @param {Object} props.session - The current game session object, containing details like input type and show scores option
 *
 * @returns {JSX.Element} The rendered Game_Options component
 * 
 */

export default function Game_Options({
	setShow_surrender, 

	setShow_options, 
	show_options, 

	session, 
}) {

	const navigate = useNavigate()
	const query_client = useQueryClient()
	const axiosPrivate = useAxiosPrivate()
	const handle_error = useErrorHandling()

	const [ loading_newGame, setLoading_newGame ] = useState(false)





	// __________________________________________________ Input Type __________________________________________________

	const mutate__input_type = useMutation({
		mutationFn: json => patch__session(axiosPrivate, json), 
		onSuccess: (_, json) => {
			query_client.setQueryData([ 'session', session.id ], prev => {
				const tmp = { ...prev }
				tmp.InputType = json.InputType
				return tmp
			})
		}
	})

	const change_inputType = event => {

		const json = {
			SessionID: session.id, 
			InputType: event.target.value
		}
		mutate__input_type.mutate(json)

	}


	// __________________________________________________ Show Scores __________________________________________________

	const mutate__show_scores = useMutation({
		mutationFn: json => patch__session(axiosPrivate, json), 
		onSuccess: (_, json) => {
			query_client.setQueryData([ 'session', session.id ], prev => {
				const tmp = { ...prev }
				tmp.ShowScores = json.ShowScores
				return tmp
			})
		}
	})

	const change_showScores = event => {

		const json = {
			SessionID: session.id, 
			ShowScores: event.target.checked
		}
		mutate__show_scores.mutate(json)

	}


	// __________________________________________________ New Game __________________________________________________

	const new_game = () => {

		if(!window.confirm('Sicher, dass dieses Spiel gelöscht werden soll?')) return 
		setLoading_newGame(true)
	
		axiosPrivate.delete(`/game?session_id=${session.id}`).then(() => {

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
			showPopup={show_options}
			setShowPopup={setShow_options}
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



				{/* __________________________________________________ ShowScores __________________________________________________ */}

				<section>
					<label>Summe anzeigen</label>

					{mutate__show_scores.isPending && <LoaderBox className='game_options_loader-showscores' dark={true}/>}

					{!mutate__show_scores.isPending && <>
						<input
							type='checkbox'
							checked={session?.ShowScores}
							onChange={change_showScores}
						/>
					</>}
				</section>



				{/* __________________________________________________ Edit __________________________________________________ */}

				<section>
					<label>Spieler bearbeiten</label>

					<a
						href={`/#/session/${session?.id}/players`}
						className='button button_reverse button_scale_3 edit'
					><PersonSettings/></a>
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
						>Neues Spiel</button>
					</>}
				</section>

			</div>
		</Popup>
	</>
}
